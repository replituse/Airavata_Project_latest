import { Element } from "@shared/schema";

export function generateINP(elements: Element[]) {
  let text = "";
  text += "C PROJECT NAME: HYDRAULIC SIMULATION\n";
  text += "SYSTEM\n";

  elements.forEach((e, i) => {
    // Simple connectivity logic for demo: linked in sequence
    // In a real app, you'd have explicit upstream/downstream properties
    if (i < elements.length - 1) {
        text += `ELEM ${e.type}_${e.name} LINK ${i + 1} ${i + 2}\n`;
    } else {
        text += `ELEM ${e.type}_${e.name} LINK ${i + 1} END\n`;
    }
  });

  text += "FINISH\n\n";
  text += "C ELEMENT PROPERTIES\n";

  elements.forEach(e => {
    const p = e.properties as any; // Cast to any to access specific properties safely
    
    if (e.type === "PIPE") {
      text += `CONDUIT ID ${e.name} LENG ${p.length || 0} DIAM ${p.diameter || 0}\n`;
      text += " ADDEDLOSS CPLUS 0.1 CMINUS 0.1\n";
      text += "FINISH\n";
    } else if (e.type === "RESERVOIR") {
      text += `RESERVOIR ID ${e.name}\n ELEV ${p.elevation || 100}\nFINISH\n`;
    } else if (e.type === "VALVE") {
      text += `VALVE ID ${e.name}\n LOSS ${p.loss || 1.2}\nFINISH\n`;
    } else if (e.type === "TURBINE") {
      text += `TURBINE ID ${e.name}\n POWER ${p.power || 100}\nFINISH\n`;
    } else if (e.type === "SURGETANK") {
      text += `SURGETANK ID ${e.name}\n ELTOP ${p.elTop || 0} ELBOTTOM ${p.elBottom || 0} DIAM ${p.diameter || 0}\n`;
      text += ` CELERITY ${p.celerity || 1000} FRICTION ${p.friction || 0.01}\nFINISH\n`;
    }
  });

  text += "\nCONTROL\n DTCOMP 0.01 TMAX 20\nFINISH\nGO\nGOODBYE";
  return text;
}
