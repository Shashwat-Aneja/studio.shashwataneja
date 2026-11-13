import PDFDocument from 'pdfkit';
import path from 'node:path';
import type {RequestSnapshot} from './request.js';
export async function buildPdf(snapshot:RequestSnapshot,id:string,created:string):Promise<Buffer>{
 const doc=new PDFDocument({size:'A4',margin:40,autoFirstPage:false,info:{Title:'BUILD DETAILS - Provisional / Pending Review',CreationDate:new Date(created),ModDate:new Date(created)}});
 // Stable document ID keeps retry attachments identical for provider idempotency.
 (doc as any)._id=Buffer.from(id.replaceAll('-',''),'hex');
 const chunks:Buffer[]=[];const done=new Promise<Buffer>((resolve,reject)=>{doc.on('data',c=>chunks.push(c));doc.on('end',()=>resolve(Buffer.concat(chunks)));doc.on('error',reject);});
 const asset=(file:string)=>path.join(process.cwd(),'server/assets',file);
 doc.registerFont('Studio',asset('NotoSans.ttf'));doc.font('Studio');
 const cream='#f4eddf',ink='#292720';let y=0;
 function page(hero=false){doc.addPage();doc.rect(0,0,595.28,841.89).fill(cream);doc.fillColor(ink);y=44;if(hero){doc.save().rect(0,0,595.28,320).clip();doc.image(asset('interior.jpg'),0,0,{cover:[595.28,320],align:'center',valign:'center'});doc.restore();const gradient=doc.linearGradient(0,0,0,320).stop(0,'#16140f',.2).stop(1,'#16140f',.94);doc.rect(0,0,595.28,320).fill(gradient);doc.fillColor('white').fontSize(10).text('SHASHWAT ANEJA / STUDIO',40,32);doc.fontSize(55).text('BUILD\nDETAILS',36,90,{lineGap:-14});doc.fontSize(11).text('PROVISIONAL / PENDING REVIEW',40,266);doc.fontSize(9).text('Not a tax invoice. No payment requested or received.',40,288);y=345;}else{doc.fontSize(10).text('BUILD DETAILS / PROVISIONAL / PENDING REVIEW',40,30);y=65;}}
 function line(text:string,size=10,color=ink){doc.fontSize(size).fillColor(color);const height=doc.heightOfString(text,{width:515});if(y+height>786)page();doc.fontSize(size).fillColor(color);doc.text(text,40,y,{width:515});y+=height+9;}
 function heading(text:string){if(y+85>786)page();y+=14;line(text,12,'#873f32');}
 page(true);
 line(`BUILD ID  ${id}`,9);line(`REQUESTED  ${new Date(created).toISOString().slice(0,10)} / ${snapshot.kind.toUpperCase()}`,9);
 line(snapshot.title,22);line(`${snapshot.contact.name} | ${snapshot.contact.email} | ${snapshot.contact.phone}`,10);
 heading('01 / PROJECT BREAKDOWN');
 for(const item of snapshot.items){line(item.label,11);line(item.amount,9,'#766d5b');}
 heading('02 / PAYMENT SUMMARY');
 line(`Indicative project estimate: ${snapshot.estimate}`,12);line('Final quotation: pending Studio review\nAmount received: INR 0\nAmount payable now: INR 0\nPayment status: NOT COLLECTED\nPayment method: Not selected - online payments disabled',10);
 line('Taxes, third-party costs, milestones and any advance are confirmed in the approved quotation. No paid status or booking confirmation is implied.',9);
 heading('03 / BUILD SPECIFICATIONS');for(const spec of snapshot.specifications)line(spec,10);
 if(snapshot.contact.notes){doc.fontSize(10);if(y+60+doc.heightOfString(snapshot.contact.notes,{width:515})>786)page();heading('04 / CUSTOMER NOTES');line(snapshot.contact.notes);}
 heading('REVIEW & APPROVAL');line('For Studio review only. Confirm scope and availability before preparing a final quotation. A finalized invoice must not be sent to the customer before approval.',10);line(`Terms accepted: ${snapshot.agreementVersion} / ${created}`,8);
 doc.end();return done;
}
