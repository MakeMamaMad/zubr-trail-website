/* Interactive model picker for ZUBR LIME, wired to real SAT models. */
document.addEventListener("DOMContentLoaded",()=>{
  const modelButtons=[...document.querySelectorAll("[data-lime-model]")];
  if(!modelButtons.length)return;
  const models=window.ZUBR_DATA.models;
  let current=models.find(m=>m.id==="SAT-500")||models[0];
  let step=1;
  const byId=id=>document.getElementById(id);
  const text=(id,s)=>{const e=byId(id);if(e)e.textContent=s};
  function render(){
    modelButtons.forEach(button=>{
      const selected=button.dataset.limeModel===current.id;
      button.classList.toggle("active",selected);
      button.setAttribute("aria-pressed",selected?"true":"false");
    });
    text("selectedModelLabel",current.id);
    text("selectedModelType",current.type);
    text("limeSpecModel",current.id);
    text("limePrimary",current.volume);
    text("limeUnloading",current.unload);
    const more=byId("limeModelLink");
    const ask=byId("limeRequestLink");
    if(more)more.href="model.html?id="+encodeURIComponent(current.id);
    if(ask)ask.href="test-drive.html?model="+encodeURIComponent(current.id);
    const specs=byId("limeSpecs");
    if(specs)specs.innerHTML=current.facts.map(([name,value])=>{
      const label=document.createElement("span");
      label.textContent=name;
      const strong=document.createElement("strong");
      strong.textContent=value;
      const row=document.createElement("div");
      row.append(label,strong);
      return row.outerHTML;
    }).join("");
    document.querySelectorAll("[data-wizard-step]").forEach(button=>{
      const isActive=Number(button.dataset.wizardStep)===step;
      button.classList.toggle("active",isActive);
      button.setAttribute("aria-pressed",String(isActive));
    });
    const titles={
      1:"Выберите модель",
      2:"Основные параметры "+current.id,
      3:"Подбор исполнения "+current.id,
      4:"Запрос на "+current.id
    };
    const descriptions={
      1:"Выберите модель в каталоге. Параметры обновятся автоматически.",
      2:"Доступные значения указаны для опубликованных исполнений модели. Для точной комплектации свяжитесь с отделом продаж.",
      3:"Осевые агрегаты, тормозные системы и другое оборудование зависят от технического задания и должны быть подтверждены специалистом.",
      4:"Нажмите «Запросить комплектацию». Откроется форма демонстрации с выбранной моделью; заявку можно отправить через почтовое приложение."
    };
    text("wizardHeadline",titles[step]);
    text("wizardHelp",descriptions[step]);
  }
  modelButtons.forEach(button=>button.addEventListener("click",()=>{
    const model=models.find(m=>m.id===button.dataset.limeModel);
    if(model){current=model;step=1;render();}
  }));
  document.querySelectorAll("[data-wizard-step]").forEach(button=>button.addEventListener("click",()=>{
    step=Number(button.dataset.wizardStep);
    render();
  }));
  render();
});
