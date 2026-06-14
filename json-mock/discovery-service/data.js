import _ from "lodash";

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
  let n = _.random(1, 10);

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
  let n = _.random(0, 5);
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
    owner: _.sample(serviceNamePrefix),
    capability: "Foods",
    minimum: _.random(1, 5),
    maximum: _.random(() => this.minimum, 7),
    documentation: "https://www.google.com",
    authorized: false,
    metered: true,
    threaded: true,
    runtime: _.sample(["JVM", "GO"]),
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
    owner: _.sample(serviceNamePrefix),
    capability: "System of Record",
    minimum: 1,
    maximum: _.random(() => this.minimum, 7),
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
    owner: _.sample(serviceNamePrefix),
    capability: "Foods",
    minimum: _.random(1, 5),
    maximum: _.random(() => this.minimum, 7),
    documentation: "https://www.google.com",
    authorized: true,
    metered: true,
    threaded: true,
    runtime: _.sample(["JVM", "GO"]),
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
      version: _.round(_.random(1.0, 5.1), 1).toString(),
      owner: _.sample(serviceNamePrefix),
      capability: "Crime Fighting",
      minimum: _.random(1, 5),
      maximum: _.random(() => this.minimum, 7),
      documentation: "https://www.google.com",
      authorized: true,
      metered: true,
      threaded: true,
      runtime: _.sample(["JVM", "GO"]),
      instances: generateRandomInstanceArray()
    });
  }
  return arr;
};

const services = getRandomService();

export { services };
