import { db } from '@/lib/db'
import { jwtVerify } from 'jose'
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret')
const seed = [
  ['Lavender Sanctuary',38,'French lavender, cedarwood, and quiet evening air.','Floral',24,4.9,'Lavender · Cedarwood','50 hours','Self Care'],
  ['Citrus Sunrise',32,'Blood orange, lemon, and bergamot for bright mornings.','Citrus',18,4.8,'Bergamot · Lemon','45 hours','Bestseller'],
  ['Mahogany Nights',48,'A deep, enveloping blend of mahogany, leather, and amber.','Woody',9,5,'Mahogany · Amber','60 hours','Seasonal'],
  ['Fireside Fig',42,'Ripe fig, smoked oak, and tonka in a warm slow burn.','Spiced',14,4.9,'Fig · Smoked oak','55 hours','New'],
]
async function setup() { await db.execute(`CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, price REAL, description TEXT, category TEXT, stock INTEGER DEFAULT 0, rating REAL DEFAULT 5, scent_notes TEXT, burn_time TEXT, tag TEXT, created_at TEXT DEFAULT (datetime('now')))`); const count=await db.execute('SELECT COUNT(*) as total FROM products'); if(Number(count.rows[0].total)===0) for(const p of seed) await db.execute({sql:'INSERT INTO products (name,price,description,category,stock,rating,scent_notes,burn_time,tag) VALUES (?,?,?,?,?,?,?,?,?)',args:p}) }
async function admin(req:Request){const token=req.headers.get('cookie')?.split(';').find(c=>c.trim().startsWith('session='))?.split('=')[1];if(!token)return false;try{return(await jwtVerify(token,SECRET)).payload.isAdmin===true}catch{return false}}
export async function GET(){await setup();return Response.json((await db.execute('SELECT * FROM products ORDER BY created_at DESC')).rows)}
export async function POST(req:Request){if(!await admin(req))return Response.json({error:'Unauthorized'},{status:401});await setup();const b=await req.json();if(!b.name||!Number.isFinite(Number(b.price)))return Response.json({error:'Name and valid price required'},{status:400});await db.execute({sql:'INSERT INTO products (name,price,description,category,stock,rating,scent_notes,burn_time,tag) VALUES (?,?,?,?,?,?,?,?,?)',args:[b.name,Number(b.price),b.description??'',b.category??'',Number(b.stock)||0,Number(b.rating)||5,b.scent_notes??'',b.burn_time??'',b.tag??'']});return Response.json({ok:true},{status:201})}
