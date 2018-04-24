process.env.DATABASE_URL = 'postgres://vagrant:vagrant@localhost:15432/vagrant'
import db from '../src/models'

// db.sequelize.sync({force: true})

// db.User.create({
//     firstName: 'Andrew',
//     lastName: 'Sun',
//     username: 'sundrew',
//     email: 'ajsun12@gmail.com',
//     password: '$2a$10$5M6T0kof5wz9bLgd1pdIBuRhhWJtEDMYks9otKO1vkUJdGrv.b.OO' // password
// })

// db.Club.create({
//     optaId: 'c1234',
//     name: "Sun's Club",
//     shortName: 'SUN'
// })

// db.Club.create({
//     optaId: 'c9876',
//     name: "Moon's Club",
//     shortName: 'MON'
// })

// db.Player.create({
//     optaId: 'p1234',
//     name: 'Andrew Sun',
//     shortName: 'A. Sun',
//     position: 'Forward',
//     birthDate: '2000-01-01',
//     country: 'USA',
//     nationality: 'USA',
//     height: '200',
//     weight: '200',
//     realPosition: 'Forward',
//     realPositionSide: 'Left',
//     clubId: 1
// })

// db.Fixture.create({
//     optaId: 'f1234',
//     homeScore: 4,
//     awayScore: 4,
//     gameDate: '2000-01-01',
//     week: 1,
//     home: 1,
//     away: 2
// })

db.PlayerStat.create({
    isHome: true,
    isStarter: true,
    stats: {},
    playerId: 1,
    fixtureId: 1
})
