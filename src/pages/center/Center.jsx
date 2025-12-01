import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import WorkerSection from '../../components/worker-section/WorkerSection'
import OrganizationSection from '../../components/organization-section/OrganizationSection'
import LogoImg from '../../assets/logo.png'


const Center = () => {
  const navigate = useNavigate();

  const stats = [
    { count: 55, label: "Xodimlar", icon: "👥" },
    { count: 18, label: "NMM milliy elementlari", icon: "🏳️" },
    { count: 174, label: "Yunesko ro'yxatiga kiritilgan NMM elementlari", icon: "🌍" },
    { count: 344, label: "Yunesko tomonidan ko'rib chiqilayotgan NMM elementlari", icon: "🏛️" },
  ];

  return (
    <div className="center-container">
    
      <div className="main-content">
        <div className="about-section">
        <div className="wrp">
        <img src={LogoImg} alt="" className="logo__" width={'55px'}/>
          <h2>Madaniyatshunoslik va nomoddiy madaniy meros ilmiy-tadqiqot instituti faoliyati haqida</h2>
        </div>
          <p>
            Institutning ilmiy va ilmiy-tashkiliy faoliyati. Institutning ilmiy va ilmiy-tashkiliy faoliyati: Madaniyatshunoslik fani va nomoddiy madaniy meros tadqiqotlari yо‘nalishlari bо‘yicha Ilmiy kengash tavsiyalari hamda jahon fani yutuqlaridan foydalangan holda о‘z faoliyatini tashkil etadi; Davlat ilmiy-texnika dasturlari doirasida bajariladigan fundamental va amaliy tadqiqotlarni belgilangan tartibda amalga oshiradi, ilmiy loyihalar asosida etnofolklor va boshqa turdagi ekspeditsiyalarni tashkillashtiradi; Tadqiqotlar davomida olingan ilmiy natijalarni jamiyat hayotiga, ta’lim tizimiga joriy etish maqsadida tegishli vazirliklar, tashkilotlar bilan hamkorlikda ish yuritadi; Zarurat bо‘lganda ilmiy tadqiqot mavzularini yangilaydi, dolzarblik talablariga javob bermagan tadqiqotlarni tо‘xtatish choralarini qо‘llaydi, zarur hollarda Institut tarkibiy tuzilishiga о‘zgartirishlar kiritish uchun О‘zbekiston Respublikasi Madaniyat vazirligiga taklif bilan chiqadi; О‘zbekiston Respublikasi Maktabgacha va maktab taʼlimi vazirligi, Oliy ta’lim fan va innovatsiyalar vazirligi tizimlari uchun madaniyatshunoslik fani va nomoddiy madaniy meros adabiyotlari, о‘quv qо‘llanmalarini tayyorlash va qayta nashr etish ishlari ekspertizasida qatnashadi; Madaniyatshunoslik va nomoddiy madaniy merosning dolzarb ilmiy va Ilmiy-amaliy muammolari bо‘yicha respublika, xalqaro miqyosdagi simpoziumlar, anjumanlar va davra suhbatlari tashkillashtiradi, soha yо‘nalishidagi ilmiy hamjamiyatlar faoliyatida ishtirok etadi; Institut jamoasini istiqbolli olimlar, iqtidorli yoshlar bilan tо‘ldirish uchun muntazam ravishda tadbirlarni amalga oshiradi; Madaniyatshunoslik fani va nomoddiy madaniy merosning turli yо‘nalishlari bо‘yicha ilmiy va ilmiy - pedagogik kadrlarni tayyorlashni takomillashtiradi, institut yetakchi olimlari tomonidan sohaviy oliy о‘quv yurtlarida ma’ruza mashg‘ulotlari о‘tkazilishini, fan doktorlari va PhD talabgorlari, magistrlarning ilmiy ishlariga rahbarlikning amalga oshirilishini ta’minlaydi; Madaniyatshunoslik fani yutuqlarini hamda nomoddiy madaniy meros asrab-avaylash, targ‘ibotini ommalashtiradi va ularni ma’naviy-ma’rifiy sohada qо‘llaydi; Ilmiy - tadqiqot natijalarini tayyorlaydi va nashrga tavsiya etadi; institut faoliyatining istiqbolli yо‘nalishini aniqlaydi, mualliflik huquqini, shuningdek, ilmiy tadqiqotlarni amalga oshirishda milliy va davlat manfaatlarini himoya qilishda kо‘maklashadi; Institut ilmiy tadqiqotlarni amalga oshirishda belgilangan tartibda tegishli tashkilotlarga bajarilgan ishlari haqida hisobotlar, ilmiy - tashkiliy ma’lumotlar tayyorlaydi va topshiradi; Institut mehnat kodeksi va tegishli hujjatlarga ko‘ra xodimlarga mehnat faoliyati bo‘yicha sharoitlar yaratadi, xodimlarning mehnat faoliyati himoyasini amalga oshiradi, yong‘in xavfsizligi, sanitariya va gigiyena, davlat ijtimoiy sug‘urtasi, shuningdek, mehnat intizomi qoidalari va me’yorlariga rioya qilinishini, institut hisobidagi mol-mulkning saqlanishini ta’minlaydi; Nomoddiy madaniy meros sohasida fundamental va amaliy ilmiy-tadqiqot ishlarini olib borish, kompleks folklor ekspeditsiyalarini tashkil etish, innovatsion texnologiyalarni keng qo‘llash, shuningdek, xalqaro hamda mahalliy ilmiy va amaliy grant loyihalarini jalb etish, tadqiqot ishlarini samarali tashkil etish maqsadida xorijdan yuqori malakali mutaxassislarni jalb etish..
          </p>
        </div>
        <div className="stats-section">
          {stats.map((stat, index) => (
            <div className="stat-card" key={index}>
              <span className="icon">{stat.icon}</span>
              <h3>{stat.count}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      <WorkerSection/>
    </div>
  );
};

export default Center;
