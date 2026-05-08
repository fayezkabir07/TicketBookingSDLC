const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const DB = require('./DB');

const nowShowingMovies = [
  {
    title: 'Oppenheimer',
    description:
      'The story of J. Robert Oppenheimer and the development of the atomic bomb during World War II.',
    genre: 'Biography / Drama',
    language: 'English',
    duration: 180,
    releaseDate: new Date('2023-07-21'),
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    timeSlots: ['10:00 AM', '01:30 PM', '05:00 PM', '09:00 PM'],
    ticketPrice: 350,
    status: 'now_showing',
  },
  {
    title: 'Barbie',
    description:
      'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land.',
    genre: 'Comedy / Fantasy',
    language: 'English',
    duration: 114,
    releaseDate: new Date('2023-07-21'),
    poster: 'https://image.tmdb.org/t/p/w500/iuFNMS8vlzmFCMvQNAFbFCkvEDN.jpg',
    cast: ['Margot Robbie', 'Ryan Gosling', 'America Ferrera', 'Kate McKinnon'],
    timeSlots: ['11:00 AM', '02:00 PM', '06:30 PM', '10:00 PM'],
    ticketPrice: 300,
    status: 'now_showing',
  },
];

const upcomingMovies = [
  {
    title: 'Dune: Part Three',
    description:
      'Paul Atreides continues his journey as the messiah of Arrakis, facing new challenges as the universe hangs in the balance.',
    genre: 'Sci-Fi / Adventure',
    language: 'English',
    duration: 165,
    releaseDate: new Date('2026-11-20'),
    poster: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Josh Brolin'],
    timeSlots: [],
    ticketPrice: 400,
    status: 'upcoming',
  },
  {
    title: 'Avatar 3',
    description:
      'Jake Sully and Neytiri venture further into the uncharted regions of Pandora, uncovering ancient secrets and facing a new threat.',
    genre: 'Sci-Fi / Action',
    language: 'English',
    duration: 180,
    releaseDate: new Date('2026-12-19'),
    poster: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Kate Winslet'],
    timeSlots: [],
    ticketPrice: 450,
    status: 'upcoming',
  },
  {
    title: 'Mission: Impossible — The Final Reckoning',
    description:
      'Ethan Hunt faces his most dangerous mission yet as a rogue AI threatens global security in this heart-pounding finale.',
    genre: 'Action / Thriller',
    language: 'English',
    duration: 163,
    releaseDate: new Date('2026-05-23'),
    poster: 'https://image.tmdb.org/t/p/w500/z53D72EAOxGRqdr7KXXWp9dJiDe.jpg',
    cast: ['Tom Cruise', 'Hayley Atwell', 'Ving Rhames', 'Simon Pegg'],
    timeSlots: [],
    ticketPrice: 380,
    status: 'upcoming',
  },
  {
    title: 'Black Panther: Wakanda Forever — Legacy',
    description:
      'The next generation of Wakandan warriors rises to defend their nation against an unprecedented cosmic threat.',
    genre: 'Action / Superhero',
    language: 'English',
    duration: 155,
    releaseDate: new Date('2026-07-04'),
    poster: 'https://image.tmdb.org/t/p/w500/sv1xJUazXoQuIDfBzIHXhJdFz1I.jpg',
    cast: ['Letitia Wright', 'Lupita Nyong\'o', 'Danai Gurira', 'Winston Duke'],
    timeSlots: [],
    ticketPrice: 370,
    status: 'upcoming',
  },
  {
    title: 'Jurassic World: Rebirth',
    description:
      'Five years after the events of Jurassic World Dominion, a covert team ventures into uncharted territory where dinosaurs have reclaimed the wild.',
    genre: 'Adventure / Sci-Fi',
    language: 'English',
    duration: 148,
    releaseDate: new Date('2026-07-02'),
    poster: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    cast: ['Scarlett Johansson', 'Jonathan Bailey', 'Mahershala Ali', 'Manuel Garcia-Rulfo'],
    timeSlots: [],
    ticketPrice: 330,
    status: 'upcoming',
  },
  {
    title: 'The Fantastic Four: First Steps',
    description:
      'Marvel\'s First Family — Reed Richards, Sue Storm, Johnny Storm, and Ben Grimm — embark on their cosmic origin story in an alternate 1960s universe.',
    genre: 'Superhero / Sci-Fi',
    language: 'English',
    duration: 130,
    releaseDate: new Date('2026-07-25'),
    poster: 'https://image.tmdb.org/t/p/w500/9l1eZiJHmhr5jIlthMdJN5WYoff.jpg',
    cast: ['Pedro Pascal', 'Vanessa Kirby', 'Joseph Quinn', 'Ebon Moss-Bachrach'],
    timeSlots: [],
    ticketPrice: 360,
    status: 'upcoming',
  },
  {
    title: 'Wicked: For Good',
    description:
      'The breathtaking conclusion to the story of Elphaba and Glinda — two unlikely friends whose bond defies gravity and changes Oz forever.',
    genre: 'Musical / Fantasy',
    language: 'English',
    duration: 145,
    releaseDate: new Date('2026-11-26'),
    poster: 'https://image.tmdb.org/t/p/w500/c5ShLZi1G5V7gEnIYYDLHSyMfgf.jpg',
    cast: ['Cynthia Erivo', 'Ariana Grande', 'Jonathan Bailey', 'Jeff Goldblum'],
    timeSlots: [],
    ticketPrice: 350,
    status: 'upcoming',
  },
];

const seedMovies = async () => {
  try {
    await DB();
    const count = await Movie.countDocuments();
    if (count === 0) {
      await Movie.insertMany([...nowShowingMovies, ...upcomingMovies]);
      console.log('Movies seeded successfully.');
    } else {
      console.log('Movies already seeded, skipping.');
    }
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedMovies();
