import * as parser from 'html2json';

export function getData(context) {
  return new Promise(resolve => {
    fetch(`http://localhost:3030/?path=${context.resolvedUrl}`)
    .then(r => r.json())
    .then(d => {
      const data = d.data;
      const html = parser.html2json(data);
      const rawHead = parseHead(html);
      resolve({
        head: rawHead,
        html: data
      });
    });
  });
}

export function parseHead(head): string[] {

  const items = head.child[0].child[0].child;
  const tags = [];
  for (let i = 0; items[i]; i ++) {
    const e = items[i];
    if (e.node !== 'text') {
      let atts = ''; 
      if (e.attr) {
        const { attr } = e;
        for (let ii in attr) {
          atts += `${ii}=${attr[ii]} `
        }
      }
      else {
        atts = '';
      }
      let tag;
      if (e.child) {
        tag = `<${e.tag} ${atts}>${e.child[0].text}</${e.tag}>`
      }
      else {
        tag = `<${e.tag} ${atts}>${e.text}</${e.tag}>`;
      }
      const clTRe = /undefined<\/\w+\>$/;
      tag = tag.replace(clTRe, '');
      tags.push(tag);
    }
    else {

    }
  }
  return tags;
}