import React from "react";
import "./style.css";

const OrganizationalStructure = () => {
  return (
    <div className="organization_container">
      <h2 className="organization_title">Tashkiliy tuzilma</h2>
      <div className="main-block">
        Исполнительный комитет Центрального Совета Союза Молодежи Узбекистана
      </div>
      <div className="sub-blocks">
        <div className="sub-block">Председатель</div>
        <div className="sub-block">Заместитель председателя</div>
      </div>
      <div className="departments">
        <div className="department">
          Отдел по работе с обучающейся узбекистанской молодежью за рубежом
        </div>
        <div className="department">
          Отдел по работе с трудящейся узбекистанской молодежью за рубежом
        </div>
        <div className="department">
          Отдел по сотрудничеству с узбекскими диаспорами за рубежом
        </div>
      </div>
    </div>
  );
};

export default OrganizationalStructure;
