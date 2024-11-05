// Importing Oak modules
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

// Import the createExitSignal function from the JS+OAI shared library
import { createExitSignal, staticServer } from "./shared/server.ts";

const app = new Application();
const router = new Router();

const sign = {
  aries: {
    start: { day: 21, month: 3 }, // 21 March
    end: { day: 19, month: 4 }, // 19 April
  },
  taurus: {
    start: { day: 20, month: 4 }, // 20 April
    end: { day: 20, month: 5 }, // 20 May
  },
  gemini: {
    start: { day: 21, month: 5 }, // 21 May
    end: { day: 20, month: 6 }, // 20 June
  },
  pisces: {
    start: { day: 19, month: 2 }, // 19 February
    end: { day: 20, month: 3 }, // 20 March
  },
  virgo: {
    start: { day: 23, month: 8 }, // 23 August
    end: { day: 22, month: 9 }, // 22 September
  },
  libra: {
    start: { day: 23, month: 9 }, // 23 September
    end: { day: 22, month: 10 }, // 22 October
  },
  capricorn: {
    start: { day: 22, month: 12 }, // 22 December
    end: { day: 19, month: 1 }, // 19 January
  },
  scorpio: {
    start: { day: 23, month: 10 }, // 23 October
    end: { day: 21, month: 11 }, // 21 November
  },
  cancer: {
    start: { day: 21, month: 6 }, // 21 June
    end: { day: 22, month: 7 }, // 22 July
  },
  leo: {
    start: { day: 23, month: 7 }, // 23 July
    end: { day: 22, month: 8 }, // 22 August
  },
  sagittarius: {
    start: { day: 22, month: 11 }, // 22 November
    end: { day: 21, month: 12 }, // 21 December
  },
  aquarius: {
    start: { day: 20, month: 1 }, // 20 January
    end: { day: 18, month: 2 }, // 18 February
  },
};

// Function to convert numbers to month strings
function getMonthName(month) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[month - 1]; // minus 1 for zero-based index
}

// Route to handle zodiac sign lookup by sign name
router.get("/api/sign/:sign", (context) => {
  console.log("Someone made a request to /api/sign/:sign");
  const requestedSign = context.params.sign.toLowerCase(); // case insensitive
  const zodiac = sign[requestedSign];

  if (zodiac) {
    const startMonthName = getMonthName(zodiac.start.month);
    const endMonthName = getMonthName(zodiac.end.month);
    console.log(`The zodiac requested is ${requestedSign}`);
    context.response.body =
      `The date range for ${requestedSign} is ${zodiac.start.day} ${startMonthName} - ${zodiac.end.day} ${endMonthName}`;
  } else {
    context.response.body = `Zodiac sign ${requestedSign} not found.`;
  }
});

// Route to handle direct date input and find matching zodiac sign
// Route to handle zodiac sign lookup by date
router.get("/api/sign-by-date", (ctx) => {
  console.log("Someone made a request to /api/sign-by-date");
  const requestedDay = parseInt(ctx.request.url.searchParams.get("day"));
  const requestedMonth = parseInt(ctx.request.url.searchParams.get("month"));

  for (const signName in sign) {
    const chosenSign = sign[signName];
    if (isDateInRange(requestedDay, requestedMonth, chosenSign)) {
      ctx.response.body =
        `The zodiac sign for ${requestedDay}/${requestedMonth} is ${signName}.`;
      console.log(`The zodiac requested is ${signName}`);
      return;
    }
  }

  ctx.response.body =
    `No matching zodiac sign found for ${requestedDay}/${requestedMonth}.`;
});

// Helper function to check if a date falls within a zodiac sign range
function isDateInRange(day, month, sign) {
  if (month === sign.start.month && day >= sign.start.day) return true;
  if (month === sign.end.month && day <= sign.end.day) return true;
  if (month > sign.start.month && month < sign.end.month) return true;
  return false;
}

// Tell the app to use the router
app.use(router.routes());
app.use(router.allowedMethods());

// Try serving undefined routes with static files
app.use(staticServer);
// Everything is set up, let's start the server
console.log("\nListening on http://localhost:8000");
await app.listen({ port: 8000, signal: createExitSignal() });
