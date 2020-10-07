import Worker from '../lib/Worker';

class GetPage extends Worker {

  constructor() {
    super();
  }

  async handler(req: any, res: any) {
    const { SITE_HOST }: any = process.env;

    const { path } = req.query;

    console.log(path)

    const resu = await this.getPage(SITE_HOST + path);

    return await res.status(200).json({
      data: resu
    });
  }
}


export default GetPage;