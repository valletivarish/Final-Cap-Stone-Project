export const htmlToPlainText = (html) => {

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    let text = tempDiv.innerHTML
      .replace(/<ul>/g, '\n')           
      .replace(/<\/ul>/g, '')           
      .replace(/<li>/g, '- ')           
      .replace(/<\/li>/g, '\n')         
      .replace(/<strong>/g, '')         
      .replace(/<\/strong>/g, '')       
      .replace(/<h3>/g, '\n')    
      .replace(/<\/h3>/g, '\n')      
      .replace(/<[^>]*>?/gm, '')        
      .replace(/\n\s*\n/g, '\n');       
  
    return text.trim();                 
  };
  