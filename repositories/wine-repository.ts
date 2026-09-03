export type Tasting={id:string;wineName:string;producer:string;country:string;grape:string;vintage:string;aromas:string;acidity:number;tannin:number;body:number;persistence:number;rating:number;buyAgain:boolean;createdAt:string};
const KEY="vinho-sem-misterio:tastings";
export const wineRepository={
findAll():Tasting[]{if(typeof window==="undefined")return[];try{return JSON.parse(localStorage.getItem(KEY)||"[]") as Tasting[]}catch{return[]}},
create(input:Omit<Tasting,"id"|"createdAt">):Tasting{const item={...input,id:crypto.randomUUID(),createdAt:new Date().toISOString()};localStorage.setItem(KEY,JSON.stringify([item,...this.findAll()]));return item},
update(id:string,changes:Partial<Tasting>):Tasting|undefined{let found:Tasting|undefined;const next=this.findAll().map(item=>item.id===id?(found={...item,...changes}):item);localStorage.setItem(KEY,JSON.stringify(next));return found},
delete(id:string){localStorage.setItem(KEY,JSON.stringify(this.findAll().filter(item=>item.id!==id)))},findById(id:string){return this.findAll().find(item=>item.id===id)}
};
