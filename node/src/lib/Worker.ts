import asyncRedis from 'async-redis';
import fetch from 'node-fetch';
import puppeteer from 'puppeteer';

class Worker {


  async getPage(url: string) {
    const browser = await puppeteer.launch({
      headless: true,
      devtools: false,
      ignoreHTTPSErrors: true
    });
    const page = await browser.newPage();
    await page.setViewport({width: 1633, height: 766});
    await page.goto(url);
    const res =  await page.evaluate(() => {
      return window.document.querySelector('html').outerHTML;
    })
    await browser.close();
    return res;
  }

  request(url: string, params: {} | any) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    return new Promise((resolve, reject) => {
      fetch(url, params)
        .then(r => r.text())
        .then(d => {
          resolve(d)
        })
        .catch(e => {
          reject(e);
        })
    })
      .catch(e => {
        console.error(12, e)
      });
  }


  getRedisClient = () => {
    const { 
      REDIS_PORT,
      REDIS_HOST,
      REDIS_PASS
     }: string | any = process.env;
    const client: any = asyncRedis.createClient(parseInt(REDIS_PORT), REDIS_HOST);
    client.auth(REDIS_PASS);
    return client;
  }


  getRedisValue = async (req: any, key: string): Promise<any> => {
    
    const client: any = this.getRedisClient();

    const getRes: any = await new Promise(async (resolve) => {
      client.on('error', (err: any) => {
        resolve(err)
      });
      const reply = await client.get(key); 
      resolve(reply);
    });

    this.closeClient(client); 
    return getRes;
  };

  delRedisValue = async (req: any, key: string): Promise<any> => {
    
    const client: any = this.getRedisClient();

    const saveRes: any = await new Promise(async (resolve) => {
      client.on('error', (err: any) => {
        resolve(err)
      });
      const reply = await client.del(key);
      resolve(reply);
    });

    this.closeClient(client);
    return saveRes;
  };

  setRedisValue = async (req: any, key: string, value: string | number): Promise<any> => {
    
    const client: any = this.getRedisClient();

    const saveRes: any = await new Promise(async (resolve) => {
      client.on('error', (err: any) => { 
        resolve(err)
      });
      const reply = await client.set(key, value);
      resolve(reply);
    });

    this.closeClient(client);
    return saveRes;
  };

  closeClient = (client: any) => {
    client.end('close');
  }

}

export default Worker;