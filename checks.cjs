const assert=require('node:assert/strict');
const {scenarios,generate,examples}=require('./templates.js');
const data={person:'Pelin',club:'GDG Mersin',event:'Future Ready',topic:'Yapay zekâ',date:'12 Ekim 14.00',link:'https://example.com/event',venue:'Google Meet',request:'Teknik ekipman',actions:'Takvimi paylaşacağız.',sender:'Burcu Aydın',detail:'Özel not.'};
let count=0;
for(const s of scenarios){
 for(const tone of ['warm','balanced','formal'])for(const channel of ['dm','email','linkedin'])for(const length of ['full','short']){
  const outputs=[0,1,2].map(i=>generate(s.id,data,{tone,channel,length},i));
  assert.equal(new Set(outputs.map(o=>o.body)).size,3,s.id+' distinct options');
  for(const o of outputs){assert.ok(o.subject&&o.body.includes('Pelin'));assert.ok(!o.body.includes('undefined'));assert.ok(o.body.includes(data.detail));if(channel==='email')assert.ok(o.body.endsWith('Burcu Aydın'));count++;}
 }
 const shorter=generate(s.id,data,{length:'short'}).body,full=generate(s.id,data,{length:'full'}).body;assert.ok(shorter.length<full.length,s.id+' short mode');
 for(const key of s.required)assert.throws(()=>generate(s.id,{...data,[key]:''}));
}
for(const ex of Object.values(examples)){const o=generate('partner',{person:ex[0],club:ex[1],event:ex[2]},{tone:'warm'},ex[3]);assert.ok(o.body.startsWith('Selamlar '+ex[0]+' 🌸\nBen Burcu Aydın'));assert.ok(o.body.endsWith('miyiz? 🙌'));}
assert.throws(()=>generate('announce',{...data,link:'javascript:alert(1)'}));
assert.ok(!generate('intro',data).body.includes(data.date),'hidden date excluded');
assert.ok(!generate('decline',data).body.includes(data.event),'hidden event excluded');
assert.ok(!generate('meeting',{...data,date:''}).body.includes(data.date),'no invented date');
console.log(count+' template combinations passed; required fields, unsafe links, original examples and hidden fields checked.');
for(const s of scenarios){
 const personal=generate(s.id,data,{channel:'email'});
 assert.ok(personal.body.endsWith('Burcu Aydın'));
 assert.ok(!/mentor ağına erişim|sponsor firma bağlantıları|etkinlik alanı rezervasyon desteği/i.test(personal.body));
 const institutional=generate(s.id,{...data,organization:'Örnek Kurum'},{channel:'email'});
 assert.ok(institutional.body.endsWith('Burcu Aydın\nÖrnek Kurum'));
}
