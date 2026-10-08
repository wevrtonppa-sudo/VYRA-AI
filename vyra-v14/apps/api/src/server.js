import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors({origin: process.env.WEB_ORIGIN || '*'}));
app.use(express.json({limit:'10mb'}));
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

app.get('/api/health', (_req,res)=>res.json({ok:true,version:'14.0.0',supabase:!!supabase}));

async function auth(req,res,next){
  if(!supabase) return res.status(503).json({error:'Supabase não configurado'});
  const token=(req.headers.authorization||'').replace(/^Bearer\s+/,'');
  if(!token) return res.status(401).json({error:'Token ausente'});
  const {data,error}=await supabase.auth.getUser(token);
  if(error || !data.user) return res.status(401).json({error:'Token inválido'});
  req.user=data.user; next();
}

app.get('/api/me',auth,async(req,res)=>{
  const {data,error}=await supabase.from('profiles').select('id,email,role,plan,unlimited_credits').eq('id',req.user.id).single();
  if(error) return res.status(404).json({error:error.message});
  res.json(data);
});

app.get('/api/projects',auth,async(req,res)=>{
  const {data,error}=await supabase.from('projects').select('*').eq('user_id',req.user.id).order('created_at',{ascending:false});
  if(error) return res.status(500).json({error:error.message}); res.json(data||[]);
});

app.get('/api/jobs',auth,async(req,res)=>{
  const {data,error}=await supabase.from('jobs').select('*').eq('user_id',req.user.id).order('created_at',{ascending:false}).limit(50);
  if(error) return res.status(500).json({error:error.message}); res.json(data||[]);
});

app.listen(process.env.PORT||8787,()=>console.log(`VYRA API on ${process.env.PORT||8787}`));
