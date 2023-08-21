import sequelize from "@/lib/mssql";
import { NextApiRequest, NextApiResponse } from "next";
import { BulletinsFormat, getBulletinHeadersQuery, getBulletinInfoQuery } from "@/utils/getQueries";

type ResponseData = unknown

type BodyProps = {
  bulletin: BulletinsFormat
}

const handleBulletins = async (
  request: NextApiRequest,
  response: NextApiResponse<ResponseData>
) => {
  try {
    const { bulletin }: BodyProps = request.body
    console.log(bulletin)
    
    const headersQuery = getBulletinHeadersQuery(bulletin)
    const infoQuery = getBulletinInfoQuery(bulletin)

    await sequelize.query(headersQuery)
    await sequelize.query(infoQuery)

    response.json({
      message: "Succesful",
    })

  } catch (error: unknown) {
    response.status(400).json(error)
  }
}

export default handleBulletins;
