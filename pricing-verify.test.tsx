import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {it,expect,vi} from 'vitest';
import {writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {services} from './src/data/packages';
import PricingPage from './src/PricingPage';
import BookingFlow from './src/components/BookingFlow';
import {parseRequest} from './server/request';
import handler from './api/booking-request';
const approved=[['₹3,999','₹7,999','₹11,999+'],['₹2,999','₹7,999','₹10,999+'],['₹2,999','₹6,999','₹11,999+'],['₹1,999','₹3,999','₹7,999+'],['₹999','₹2,499','₹5,999+'],['₹2,499','₹5,999','₹11,999+'],['₹9,999','₹19,999','₹39,999+'],['₹1,999','₹5,999','₹14,999+'],['₹999 / month','₹2,499 / month','₹4,999 / month']];
const contact={name:'Pricing Verification',email:'pricing-test@example.com',phone:'+91 9876543210',notes:''};
function response(){return{statusCode:0,headers:{},body:null as any,setHeader(){},end(s:string){this.body=JSON.parse(s)}};}
function request(body:unknown){return{method:'POST',headers:{origin:'https://studio.test',host:'studio.test','content-type':'application/json'},body};}
it('verifies all 27 packages through rendered frontend, authoritative server, PDF attachments and mocked email payloads',async()=>{
 vi.stubEnv('RESEND_API_KEY','pricing-verification-no-real-secret');vi.stubEnv('STUDIO_FROM_EMAIL','Studio <studio@mail.shashwataneja.com>');
 const page=renderToStaticMarkup(<PricingPage/>);expect((page.match(/class="service-price-card"/g)||[]).length).toBe(9);
 const folder=resolve('output/pdf/package-pricing');mkdirSync(folder,{recursive:true});const manifest=[];
 try{for(let i=0;i<services.length;i++)for(let j=0;j<3;j++){
  const s=services[i],t=s.tiers[j],price=approved[i][j];expect(t.price).toBe(price);expect(page).toContain(`<strong>${price}</strong>`);
  const form=renderToStaticMarkup(<BookingFlow selection={{serviceId:s.number,tier:t.name}} onClose={()=>{}}/>);expect(form).toContain(`<strong>${price}</strong>`);
  const body={kind:'package',selection:{serviceId:s.number,tier:t.name},contact,agreementAccepted:true,adultDeclared:true,website:'',price:1};
  const snapshot=parseRequest(body);expect(snapshot.estimate).toBe(price);expect(snapshot.items[0].amount).toBe(price);
  const emails:any[]=[];vi.stubGlobal('fetch',vi.fn(async(_url,options)=>{emails.push(JSON.parse(String(options.body)));return new Response(JSON.stringify({id:'mock-only'}),{status:200})}));
  const prepare=response();await handler(request({...body,action:'prepare'}),prepare);expect(prepare.statusCode).toBe(200);
  const submit=response();await handler(request({...body,action:'submit',identity:prepare.body.identity}),submit);expect(submit.statusCode).toBe(200);expect(emails.length).toBe(2);expect(emails[0].attachments[0].content).toBe(emails[1].attachments[0].content);
  for(const email of emails){expect(email.text).toContain(price);if(email.html)expect(email.html).toContain(price);expect(email.attachments[0].content_type||'application/pdf').toBe('application/pdf')}
  const filename=`${s.number}-${t.name}.pdf`;writeFileSync(folder+'/'+filename,Buffer.from(emails[0].attachments[0].content,'base64'));manifest.push({filename,price,service:s.name,tier:t.name});
 }
 writeFileSync(folder+'/manifest.json',JSON.stringify(manifest));
 }finally{vi.unstubAllEnvs();vi.unstubAllGlobals()}
},30000);
