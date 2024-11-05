import express from "express";

const app = express();

const port = process.env.PORT || 3002;

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
        start: { day: 21, month: 5 }, // 21 June
        end: { day: 22, month: 6 }, // 22 July
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

// function for numbers -> month string
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
    return monthNames[month - 1]; // minus 1 for index number 0
}

app.get("/sign/:sign", (req, res) => { //sign string as input
    const requestedSign = req.params.sign.toLowerCase(); // disregard capitalized letters
    const zodiac = sign[requestedSign];

    // Check if the sign exists
    if (sign[requestedSign]) {
        const zodiac = sign[requestedSign];
        const startMonthName = getMonthName(zodiac.start.month);
        const endMonthName = getMonthName(zodiac.end.month);

        // Print the range of the zodiac sign
        console.log(
            `The date range for ${requestedSign} is ${zodiac.start.day} ${startMonthName} - ${zodiac.end.day} ${endMonthName}`,
        );

        res.send(
            `The date range for ${requestedSign} is ${zodiac.start.day} ${startMonthName} - ${zodiac.end.day} ${endMonthName}`,
        );
    }
});
app.get("/", (req, res) => { // Root path to handle date input directly
    const requestedDay = parseInt(req.query.day); // day as numbers
    const requestedMonth = parseInt(req.query.month); // month as numbers

    // Loop through each sign to find the zodiac that matches the given day and month
    for (const signName in sign) {
        const chosenSign = sign[signName];
        if (isDateInRange(requestedDay, requestedMonth, chosenSign)) {
            console.log(
                `The zodiac sign for ${requestedDay}/${requestedMonth} is ${signName}.`,
            );
            res.send(
                `The zodiac sign for ${requestedDay}/${requestedMonth} is ${signName}.`,
            );
        }
    }
});

function isDateInRange(day, month, sign) { //range for date input, see if date is within range of any zodiac sign
    if (month === sign.start.month && day >= sign.start.day) return true;
    if (month === sign.end.month && day <= sign.end.day) return true;
    if (month > sign.start.month && month < sign.end.month) return true;
    return false;
}

app.listen(port, () => {
    console.log(`My new app is listening on port ${port}`);
});
