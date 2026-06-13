(function(){
var old=document.getElementById("fb");if(old){old.remove();return;}
var s=document.createElement("style");s.textContent="@keyframes sp{to{transform:rotate(360deg)}}";document.head.appendChild(s);
var o=document.createElement("div");o.id="fb";
o.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:2147483647;display:flex;align-items:center;justify-content:center;direction:rtl;font-family:Arial,sans-serif";
var b=document.createElement("div");
b.style.cssText="background:#1a1f2e;border-radius:14px;width:340px;max-height:85vh;overflow-y:auto";
b.innerHTML='<div style="background:linear-gradient(135deg,#2563eb,#7c3aed);padding:14px 16px;border-radius:14px 14px 0 0;display:flex;justify-content:space-between;align-items:center"><span style="color:#fff;font-size:14px;font-weight:700">🤖 تحليل AI</span><button onclick="document.getElementById(\'fb\').remove()" style="background:rgba(255,255,255,0.2);border:none;color:#fff;width:24px;height:24px;border-radius:5px;cursor:pointer">✕</button></div><div id="fb-b" style="padding:14px"><div style="text-align:center;padding:20px;color:#8892a4"><div style="width:28px;height:28px;border:3px solid #2d3548;border-top-color:#2563eb;border-radius:50%;animation:sp 0.8s linear infinite;margin:0 auto 10px"></div>جاري التحليل...</div></div>';
o.appendChild(b);document.body.appendChild(o);
o.onclick=function(e){if(e.target===o)o.remove();};

function E(m){document.getElementById("fb-b").innerHTML='<div style="text-align:center;padding:20px;color:#f97316;line-height:1.8">⚠️<br>'+m+'</div>';}
function C(n,c,l){return'<div style="background:#242938;border-radius:8px;padding:8px 6px;text-align:center;border:1px solid #2d3548"><div style="font-size:20px;font-weight:800;color:'+c+'">'+n+'</div><div style="font-size:10px;color:#8892a4">'+l+'</div></div>';}
function A(t,ti,d){var m={red:["rgba(239,68,68,0.12)","rgba(239,68,68,0.3)","#fca5a5"],orange:["rgba(249,115,22,0.12)","rgba(249,115,22,0.3)","#fdba74"],blue:["rgba(59,130,246,0.12)","rgba(59,130,246,0.3)","#93c5fd"],green:["rgba(34,197,94,0.12)","rgba(34,197,94,0.3)","#86efac"]};var c=m[t];return'<div style="background:'+c[0]+';border:1px solid '+c[1]+';border-radius:7px;padding:8px 11px;margin-bottom:6px;color:'+c[2]+'"><strong style="display:block;font-size:12px;margin-bottom:2px">'+ti+'</strong>'+(d?'<div style="font-size:11px;opacity:0.7">'+d+'</div>':'')+'</div>';}
function T(t){if(!t)return 0;var m=t.match(/(\d+):(\d+)\s*(AM|PM)?/i);if(!m)return 0;var h=+m[1],p=(m[3]||"").toUpperCase();if(p==="PM"&&h!==12)h+=12;if(p==="AM"&&h===12)h=0;return h*60+(+m[2]);}
function R(s){if(!s)return null;var p=s.split(" - "),a=T(p[0]);return{s:a,e:p[1]?T(p[1]):a+30};}

function calc(data){
// البيانات ترجع كـ array مباشرة
var a=Array.isArray(data)?data:(data.results||[]);
if(!a.length){E("لا توجد بيانات اليوم");return;}

var st={total:a.length,ar:0,al:0,ie:0,an:0,rd:0,ca:0,ns:0,co:0,nr:0,pe:0,ea:0,lp:[],cf:[]};

a.forEach(function(x){
  // الـ API يستخدم status_id
  var id=x.status_id||x.appt_status;
  if(id==2)st.ar++;
  else if(id==3){st.al++;st.lp.push(x);}
  else if(id==4)st.ie++;
  else if(id==5)st.an++;
  else if(id==6)st.rd++;
  else if(id==7||id==13||id==29)st.ca++;
  else if(id==8)st.ns++;
  else if(id==9)st.co++;
  else if(id==10)st.nr++;
  else if(id==11)st.pe++;
  else if(id==12)st.ea++;
});

// تضارب المواعيد
var bp={};
a.forEach(function(x){
  if(!x.start_time||[7,8,13,29].indexOf(x.status_id||x.appt_status)>-1)return;
  var p=x.provider_name||x.provider_id||"غير محدد";
  if(!bp[p])bp[p]=[];bp[p].push(x);
});
Object.keys(bp).forEach(function(pv){
  var l=bp[pv];
  for(var i=0;i<l.length;i++)for(var j=i+1;j<l.length;j++){
    var ts1=new Date(l[i].start_time).getTime();
    var te1=new Date(l[i].end_time||l[i].start_time).getTime()+1800000;
    var ts2=new Date(l[j].start_time).getTime();
    var te2=new Date(l[j].end_time||l[j].start_time).getTime()+1800000;
    if(ts1<te2&&ts2<te1)st.cf.push({pv:pv,p1:l[i].customer_name||"؟",p2:l[j].customer_name||"؟"});
  }
});

var ps=st.ar+st.al+st.ie+st.an+st.ea+st.co;
var wt=st.rd+st.pe+st.nr;

var h='<div style="color:#8892a4;font-size:11px;font-weight:700;margin-bottom:8px">📊 إحصائيات اليوم</div>';
h+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:8px">';
h+=C(ps,"#22c55e","حضروا")+C(st.al,"#f97316","متأخر")+C(st.ns,"#ef4444","No Show");
h+=C(st.ca,"#6b7280","ملغي")+C(st.ie,"#3b82f6","بالفحص")+C(wt,"#a855f7","انتظار");
h+='</div><div style="text-align:center;color:#8892a4;font-size:11px;margin-bottom:9px;padding-bottom:9px;border-bottom:1px solid #2d3548">الإجمالي: '+st.total+' حجز</div>';
h+='<div style="color:#8892a4;font-size:11px;font-weight:700;margin-bottom:8px">⚠️ تنبيهات</div>';

var ha=false;
if(st.cf.length){ha=true;h+=A("red","🔴 تضارب ("+st.cf.length+")",st.cf.slice(0,3).map(function(c){return"• "+c.p1+" ↔ "+c.p2;}).join("<br>"));}
if(st.al>0){ha=true;h+=A("orange","🟠 "+st.al+" متأخر",st.lp.slice(0,3).map(function(p){return"• "+(p.customer_name||"؟");}).join("<br>"));}
if(st.ns>0){ha=true;h+=A("red","🔴 "+st.ns+" No Show","يُنصح بالتواصل معهم");}
if(ps>10){ha=true;h+=A("blue","🔵 ازدحام — "+ps+" بالعيادة","");}
if(!ha)h+=A("green","✅ كل شي تمام","");
h+='<div style="text-align:center;color:#6b7280;font-size:10px;margin-top:8px">'+new Date().toLocaleTimeString("ar-IQ")+'</div>';
document.getElementById("fb-b").innerHTML=h;
}

try{
var raw=localStorage.getItem("GetStorage");
if(!raw){E("سجل الدخول أول");return;}
var tk=JSON.parse(raw).access_token;
if(!tk){E("لم يتم العثور على token");return;}
var td=new Date();
var d=td.getFullYear()+"-"+String(td.getMonth()+1).padStart(2,"0")+"-"+String(td.getDate()).padStart(2,"0");
var fd=encodeURIComponent(d+" 00:00:00.000");
var td2=encodeURIComponent(d+" 23:59:59.000");
var url="https://duaa-api.wowbooking.one/appointment/date-range/?offset=0&limit=10000&from_date="+fd+"&to_date="+td2+"&status_ids=1&status_ids=2&status_ids=3&status_ids=4&status_ids=5&status_ids=6&status_ids=7&status_ids=8&status_ids=9&status_ids=10&status_ids=11&status_ids=12&status_ids=13&status_ids=29&facility_id=1";
fetch(url,{headers:{"Authorization":"Bearer "+tk}})
.then(function(r){return r.json();})
.then(function(d){calc(d);})
.catch(function(e){E("خطأ: "+e.message);});
}catch(e){E("خطأ: "+e.message);}
})();
