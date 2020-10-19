import Head from 'next/head'
import React, { useEffect } from 'react';
import rParser from 'html-react-parser';
import { useRouter } from 'next/router'
import { getData } from './lib';
import { changeLinks } from './utils'
const isServer = typeof window === 'undefined';


export async function getServerSideProps(context) {

  const data: any = await getData(context)

  return {
    props: {
      head: data.head,
      html: data.html
    }
  }
}


export default function Component({head, html}) {
  
  let newHead = head.map(tag => {
    return rParser(tag);
  });
  
  const ht: any = rParser(html);
  const { children } = ht.props;
  let body;
  for (let prop in children) {
    if (children[prop].type === 'body') body = children[prop];
  }

  const bodyClass = body.props.className;
  const htmlClass = ht.props.className;

  let newBody = changeLinks(body);
  const E = (props) => (<div {...props.body}></div>);
  newBody = <E body={body.props} children={newBody.props.children}/>;

  const router = useRouter();

  useEffect(() => { 
    const { body } = document;
    const html = document.querySelector('html');
    bodyClass.split(' ').map(item => {
      body.classList.add(item);
    });
    htmlClass.split(' ').map(item => {
      html.classList.add(item);
    });
  }, [router.asPath, bodyClass, htmlClass]);

  return( 
    <div>
      <Head>{ newHead }</Head>
      <div>{ newBody}</div>
    </div>)
}