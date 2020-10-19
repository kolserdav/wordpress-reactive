import Link from 'next/link'

export function changeLinks(body) {
  let newBody: any = {};
  for (let r in body) {
    if (r === 'props') {
      newBody[r] = {};
      for (let d in body.props) {
        newBody.props[d] = body.props[d];
      }  
    }
    else {
      newBody[r] = body[r];
    }
  }
  if (!body.props) return newBody;
  const regServer = /^https?:\/\/wref.loc/;
  for (let p in body.props.children) {
    if (Array.isArray(body.props.children)) {
      if (!body.props.children[p]) continue;
      if (!body.props.children[p].type && p) continue;
      if (body.props.children[p].type === 'text') continue;
      if (body.props.children[p].type === 'a') {
        const eProps = body.props.children[p].props;
        let props = [];
        for (let pp in eProps) {
          if (pp !== 'href' && pp !== 'children') {
            props.push({
              [pp]: eProps[pp]
            });
          }
        }
        let href = body.props.children[p].props.href;
        if (href.match(regServer)) {
          href = href.replace(regServer, '');
          if (href === '') href = '/';
          newBody.props.children[p] = (
            <Link href={href} {...props}><a>{body.props.children[p].props.children}</a></ Link>
          );
        }
      }
      else {
        if (!body.props.children[p].props) continue;
        if (body.props.children[p].props.children) {
          newBody.props.children[p] = changeLinks(body.props.children[p]);
        }
      }
    }
    else {
      if (p === 'type' && body.props.children[p] === 'a') {
        let href = body.props.children.props.href;
        const eProps = body.props.children.props;
        let props = [];
        for (let pp in eProps) {
          if (pp !== 'href' && pp !== 'children') {
            props.push({
              [pp]: eProps[pp]
            });
          }
        }
        if (href.match(regServer)) {
          href = href.replace(regServer, '');
          if (href === '') href = '/';
          newBody.props.children = (
            <Link href={href} {...props}><a>{body.props.children.props.children}</a></ Link>
          );
        }
      }
    }
  }
  return newBody;
}