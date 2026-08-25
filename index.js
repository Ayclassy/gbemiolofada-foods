import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app=express();
const prisma=new PrismaClient();
app.use(cors({origin:process.env.CLIENT_URL||"http://localhost:5173"}));
app.use(express.json());

const auth=(req,res,next)=>{
  try{
    const token=(req.headers.authorization||"").replace("Bearer ","");
    req.user=jwt.verify(token,process.env.JWT_SECRET);
    next();
  }catch{return res.status(401).json({message:"Unauthorized"});}
};

app.get("/api/health",(req,res)=>res.json({ok:true,service:"Gbemiolofada Foods API"}));

app.get("/api/menu",async(req,res)=>{
  const items=await prisma.menuItem.findMany({where:{active:true},orderBy:{createdAt:"desc"}});
  res.json(items);
});

app.post("/api/auth/signup",async(req,res)=>{
  const {name,phone,password}=req.body;
  if(!name||!phone||!password||password.length<8)return res.status(400).json({message:"Name, phone and an 8+ character password are required."});
  const exists=await prisma.user.findUnique({where:{phone}});
  if(exists)return res.status(409).json({message:"Account already exists."});
  const passwordHash=await bcrypt.hash(password,12);
  const user=await prisma.user.create({data:{name,phone,passwordHash}});
  const token=jwt.sign({id:user.id,role:user.role},process.env.JWT_SECRET,{expiresIn:"7d"});
  res.status(201).json({token,user:{id:user.id,name:user.name,phone:user.phone,role:user.role}});
});

app.post("/api/auth/login",async(req,res)=>{
  const {phone,password}=req.body;
  const user=await prisma.user.findUnique({where:{phone}});
  if(!user||!(await bcrypt.compare(password,user.passwordHash)))return res.status(401).json({message:"Invalid credentials."});
  const token=jwt.sign({id:user.id,role:user.role},process.env.JWT_SECRET,{expiresIn:"7d"});
  res.json({token,user:{id:user.id,name:user.name,phone:user.phone,role:user.role}});
});

app.post("/api/orders",auth,async(req,res)=>{
  const {address,notes,items}=req.body;
  if(!address||!Array.isArray(items)||!items.length)return res.status(400).json({message:"Address and items are required."});
  const ids=items.map(x=>x.menuItemId);
  const menu=await prisma.menuItem.findMany({where:{id:{in:ids},active:true}});
  const map=new Map(menu.map(x=>[x.id,x]));
  let subtotal=0;
  const orderItems=items.map(x=>{
    const m=map.get(x.menuItemId);
    if(!m)throw new Error("Invalid menu item");
    const quantity=Math.max(1,Math.min(50,Number(x.quantity)));
    subtotal+=m.price*quantity;
    return {menuItemId:m.id,quantity,unitPrice:m.price};
  });
  const deliveryFee=500;
  const order=await prisma.order.create({
    data:{code:"GBF-"+Math.floor(1000+Math.random()*9000),userId:req.user.id,address,notes,subtotal,deliveryFee,total:subtotal+deliveryFee,items:{create:orderItems}}
  });
  res.status(201).json(order);
});

app.get("/api/orders/me",auth,async(req,res)=>{
  const orders=await prisma.order.findMany({where:{userId:req.user.id},include:{items:{include:{menuItem:true}}},orderBy:{createdAt:"desc"}});
  res.json(orders);
});

app.get("/api/admin/orders",auth,async(req,res)=>{
  if(req.user.role!=="ADMIN")return res.status(403).json({message:"Forbidden"});
  const orders=await prisma.order.findMany({include:{user:true,items:{include:{menuItem:true}}},orderBy:{createdAt:"desc"}});
  res.json(orders);
});

app.patch("/api/admin/orders/:id/status",auth,async(req,res)=>{
  if(req.user.role!=="ADMIN")return res.status(403).json({message:"Forbidden"});
  const allowed=["NEW","PREPARING","READY","COMPLETED","CANCELLED"];
  if(!allowed.includes(req.body.status))return res.status(400).json({message:"Invalid status"});
  const order=await prisma.order.update({where:{id:req.params.id},data:{status:req.body.status}});
  res.json(order);
});

const port=process.env.PORT||4000;
app.listen(port,()=>console.log(`Gbemiolofada API running on :${port}`));
