import { Element } from "@shared/schema";

export function generateINP(elements: Element[]) {
  let text = "";
  text += "C PROJECT NAME: HYDRAULIC SIMULATION\n";
  text += "SYSTEM\n";

  // System connectivity
  elements.forEach((e) => {
    if (e.nodeA !== null && e.nodeB !== null) {
      text += `    EL ${e.name} LINK ${e.nodeA} ${e.nodeB}\n`;
    } else if (e.nodeA !== null) {
      text += `    EL ${e.name} AT ${e.nodeA}\n`;
    }
  });

  text += "FINISH\n\n";
  text += "C ELEMENT PROPERTIES\n";

  elements.forEach(e => {
    const p = e.properties as any;
    
    if (e.type === "CONDUIT") {
      text += `CONDUIT ID ${e.name}\n`;
      text += `    LENG ${p.length || 1000} DIAM ${p.diameter || 12} FRIC ${p.friction || 0.01}\n`;
      text += `    CPLUS ${p.cPlus || 0.1} CMINUS ${p.cMinus || 0.1}\n`;
      text += "FINISH\n\n";
    } else if (e.type === "RESERVOIR") {
      text += `RESERVOIR ID ${e.name}\n    ELEV ${p.elevation || 100}\nFINISH\n\n`;
    } else if (e.type === "VALVE") {
      text += `VALVE ID ${e.name}\n    LOSS ${p.loss || 1.2}\nFINISH\n\n`;
    } else if (e.type === "SURGETANK") {
      text += `SURGETANK ID ${e.name}\n    ELTOP ${p.elTop || 150} ELBOT ${p.elBottom || 50} DIAM ${p.diameter || 10}\n`;
      text += "FINISH\n\n";
    } else if (e.type === "D_CHANGE") {
      text += `D_CHANGE ID ${e.name}\n    DIAM ${p.diameter || 12}\nFINISH\n\n`;
    }
  });

  text += "CONTROL\n    DTCOMP 0.01 DTOUT 0.1 TMAX 20.0\nFINISH\n\nGO\nGOODBYE";
  return text;
}
