import { NextApiRequest, NextApiResponse } from "next"
const { DataTypes } = require('sequelize');
import sequelize from "@/lib/mssql"
import getPlaceholderProducts from "@/utils/getPlaceholderProducts";

export type JDEProduct = {
  IMDSC1: string;
  IMLITM: string;
}

export type StoreProduct = {
  STOCKCOD: string;
  STOCKCANT: number;
  IMLITM: string;
  MCCO: string;
  LIMCU: string;
}

const products = async (request: NextApiRequest, response: NextApiResponse) => {
  // LOS SKU ACTIVOS
  const queryString = `
    select * FROM OPENQUERY(
      JDE, 
      'SELECT IMDSC1, IMLITM FROM PRODDTA.F4101 LEFT OUTER JOIN PRODDTA.F4102 
      ON (IMITM=IBITM) WHERE (LTRIM(RTRIM(IMSRP1)) <> '''') AND  TRIM(IMPRP1) IN (''PT'', ''PB'') 
      AND TRIM(IBSTKT) NOT IN (''O'', ''U'') AND IMLITM IN (
        ''15197'',''15198'',''15210'',''15707'',''15YY2'',''15553'',''15260'',''15258'',''15253'',''15254'',''15255'',
        ''15583'',''15582'',''15714'',''15265'',''15261'',''15289'',''15292'',''15290'',''15278'',''15293'',''15232'',
        ''15156'',''15157'',''15679'',''15678'',''15729'',''15723'',''15727'',''15240'',''15244'',''15246'',''15251'',
        ''15239'',''15245'',''15243'',''15230'',''15220'',''15219'',''15229'',''15249'',''15217'',''15218'',''15736'',
        ''15381'',''15379'',''15372'',''15380'',''15374'',''15737'',''15342'',''15267'',''15282'',''15286'',''15281'',
        ''15280'',''15287'',''15284'',''15272'',''15271'',''15275'',''15276'',''15274'',''15610'',''15430'',''15295'',
        ''15296'',''15228'',''15298'',''15297'',''15588'',''15288'',''15355'',''15353'',''15324'',''15330'',''15323'',
        ''15326'',''15322'',''15320'',''15339'',''15329'',''15340'',''15336'',''15338'',''15352'',''15348'',''15128'',
        ''15X14'',''15739'',''15149'',''15152'',''15153'',''15158'',''15172'',''15753'',''15754'',''15752'',''15196'',
        ''15558'',''15740'',''15704'',''15758'',''15760'',''15761'',''15762'',''15266'',''15765'',''15766'',''15764'',
        ''15767'',''15759'',''15154'',''15770'',''15768'',''15159'',''15672'',''15645'',''15673'',''15647'',''15671'',
        ''15773'',''15772'',''15774'',''15561'',''15557'',''15560'',''15771'',''15775'',''15777'',''15674'',''15216'',
        ''15776'',''15779'')
      AND TRIM(IBMCU) IN (''VE03'')   
    ')
  `
  // STOCK ALMACEN VEO3
  const queryString2 = `
    select * from OPENQUERY(
      JDE, 
      'SELECT TRIM(IMLITM) AS StockCod, ''07200'' AS MCCO, 
      TRIM(LIMCU) AS LIMCU, IMLITM, CAST(SUM((LIPQOH/10000)-(LIHCOM/10000)) AS NUMERIC(20, 0)) AS StockCant 
      FROM PRODDTA.F41021 LEFT OUTER JOIN PRODDTA.F4101 ON (LIITM=IMITM) LEFT OUTER JOIN PRODDTA.F4102 
      ON (LIITM=IBITM) AND (LIMCU=IBMCU) WHERE TRIM(LILOTS) = '''' AND TRIM(LIMCU) IN (''VE03'') 
      AND TRIM(IMSRP1) <> ''''  AND IMPRP1 IN (''PT'', ''PB'') AND IBSTKT NOT IN (''O'', ''U'') and LIPQOH <>''0''
      GROUP BY TRIM(LIMCU), LIMCU, IMLITM')
  `
  // const data: JDEProduct[] = getPlaceholderProducts()
  const [data] = await sequelize.query(queryString) as [JDEProduct[], unknown]
  const [data2] = await sequelize.query(queryString2) as [StoreProduct[], unknown]

  console.log('data2', data2)

  const products = data.map(({ IMLITM, IMDSC1 }) => {

    const storeProduct = data2.find((store) => store.IMLITM === IMLITM)

    const product = {
      sku: IMLITM,
      name: IMDSC1,
      image: `/product-images/${IMLITM}.png`,
      available: 0,
      quantity: 0,
      price: 0,
    }

    if (storeProduct)
      return ({
        ...product,
        available: storeProduct.STOCKCANT,
      })

    return product
  })

  console.log('response', products)
  response.status(200).json(products)
}

export default products