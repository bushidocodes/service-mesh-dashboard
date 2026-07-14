// Minimal vanilla replacements for the few lodash helpers this mock used.
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => Math.random() * (max - min) + min;
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
const round = (value, precision = 0) => {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

const serviceNamePrefix = [
  "AAC",
  "Discovery",
  "Export",
  "ICPF",
  "Odrive",
  "Team",
  "Up2",
  "Bootstrap",
  "Authentication",
  "Backroom",
  "Domain",
  "Gateway",
  "Internet",
  "File",
  "Transfer",
  "Message",
  "Mail",
  "User",
  "Network",
  "Management",
  "Remote",
  "Job",
  "Entry",
  "Sequential",
  "Resource",
  "Routing",
  "Virtual",
  "Structure",
  "Transmission",
  "Statistics"
];
const serviceNamePostfix = [
  "Service",
  "Analysis",
  "Program",
  "Protocol",
  "System",
  "Channel",
  "Device",
  "Editor",
  "End",
  "Version",
  "Monitoring",
  "Entry",
  "News",
  "Information",
  "Debugger",
  "Measurement",
  "Option",
  "Infrastructure",
  "Application"
];

const generateRandomServiceName = () => {
  let n = randomInt(1, 10);

  // shuffle the array and get n prefixes after the shuffle
  return (
    serviceNamePrefix
      .sort(() => 0.5 - Math.random())
      .slice(0, n)
      .join(" ") +
    " " +
    serviceNamePostfix.sort(() => 0.5 - Math.random()).slice(0, 1)
  );
};

const generateRandomInstanceArray = () => {
  let n = randomInt(0, 5);
  let arr = [];
  for (let i = 0; i < n; i++) {
    arr.push({
      name: Array.from({ length: 21 }, () =>
        Math.floor(Math.random() * 36).toString(36)
      ).join(""),
      start_time: Math.floor(Math.random() * Date.now())
    });
  }
  return arr;
};

const getRandomService = (quantity = 150) => {
  let arr = [];
  // Explicitly add a service that is NOT authorized
  // This is a chips and cheese microservice, nachos!
  arr.push({
    name: "Nachos",
    version: "1.0",
    owner: sample(serviceNamePrefix),
    capability: "Foods",
    minimum: randomInt(1, 5),
    maximum: randomInt(0, 7),
    documentation: "https://www.google.com",
    authorized: false,
    metered: true,
    threaded: true,
    runtime: sample(["JVM", "GO"]),
    instances: [
      {
        name: "ee0fa3669fea7e9a0adea649c46bca56",
        start_time: 1508854912461
      }
    ]
  });
  arr.push({
    name: "Grace Hopper Battleship Control Program",
    version: "1.0",
    owner: sample(serviceNamePrefix),
    capability: "System of Record",
    minimum: 1,
    maximum: randomInt(0, 7),
    documentation: "https://en.wikipedia.org/wiki/Grace_Hopper",
    authorized: true,
    metered: false,
    threaded: false,
    runtime: "COBOL",
    instances: [
      {
        name: "ee0fa3669fea7e9a0adea649c46bca56",
        start_time: 1508854912461
      }
    ]
  });
  arr.push({
    name: "Crashy McCrashface (USA USA)",
    version: "1.0",
    owner: sample(serviceNamePrefix),
    capability: "Foods",
    minimum: randomInt(1, 5),
    maximum: randomInt(0, 7),
    documentation: "https://www.google.com",
    authorized: true,
    metered: true,
    threaded: true,
    runtime: sample(["JVM", "GO"]),
    instances: [
      {
        name: "ee0fa3669fea7e9a0adea649c46bca56",
        start_time: 1508854912461
      }
    ]
  });
  for (let i = 0; i < quantity; i++) {
    arr.push({
      name: generateRandomServiceName(),
      version: round(randomFloat(1.0, 5.1), 1).toString(),
      owner: sample(serviceNamePrefix),
      capability: "Crime Fighting",
      minimum: randomInt(1, 5),
      maximum: randomInt(0, 7),
      documentation: "https://www.google.com",
      authorized: true,
      metered: true,
      threaded: true,
      runtime: sample(["JVM", "GO"]),
      instances: generateRandomInstanceArray()
    });
  }
  return arr;
};

const services = getRandomService();

export { services };
