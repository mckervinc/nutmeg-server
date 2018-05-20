import * as dotenv from 'dotenv'
dotenv.config()
import * as airtable from 'airtable'

const base = airtable.base('app8CDpjTDcvuZrsJ')
import models from '../src/models';

const { Feed, sequelize } = models;

const doStuff = async () => {
    const feedDate = await sequelize.query('SELECT MAX("createdAt") as date FROM feeds', { type: sequelize.QueryTypes.SELECT })
    const maxDate = feedDate[0].date || '2000-01-01';
    base('Feed').select({
        filterByFormula: `is_after({Created At}, "${maxDate}")`,
        sort: [{field: 'Created At', direction: 'desc'}]
    }).firstPage(async (err, records) => {
        if (err) console.error('AIRTABLE ERROR:', err);
        for (const record of records) {
            const newRecord: any = {}
            newRecord.title = record.get('Title')
            newRecord.link = record.get('Link')
            newRecord.image = record.get('Image') ? record.get('Image')[0].url : undefined
            newRecord.type = record.get('Type')
            newRecord.createdAt = record.get('Created At')
            console.log(newRecord)
            try {
                await Feed.create(newRecord)
            } catch (error) {
                console.error(error)
                process.exit(1)
            }
        }
        process.exit(0)
    })
}

doStuff()
