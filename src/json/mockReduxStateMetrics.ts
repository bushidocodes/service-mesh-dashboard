export default {
  dashboards: {
    go: {
      name: "Go",
      runtime: "GO",
      summaryCard: {
        icon: "Go",
        chart: {
          type: "value",
          dataAttribute: "go_metrics/runtime/alloc_bytes"
        },
        lines: [
          {
            name: "Heap Used",
            value: [
              {
                type: "latest",
                value: "go_metrics/runtime/alloc_bytes",
                baseUnit: "B",
                resultUnit: "MB",
                precision: 3
              },
              { type: "string", value: "MB" }
            ]
          }
        ]
      },
      grid: {
        breakpoints: { lg: 1200, md: 996, sm: 768 },
        cols: { lg: 12, md: 8, sm: 4 },
        layouts: {
          lg: [
            { i: "Heap", x: 0, y: 0, w: 6, h: 9, minW: 4, minH: 5 },
            { i: "Goroutines", x: 6, y: 0, w: 6, h: 9, minW: 4, minH: 5 }
          ],
          md: [
            { i: "Heap", x: 0, y: 0, w: 8, h: 9, minW: 4, minH: 5 },
            { i: "Goroutines", x: 0, y: 9, w: 8, h: 9, minW: 4, minH: 5 }
          ],
          sm: [
            { i: "Heap", x: 0, y: 0, w: 6, h: 9, minW: 4, minH: 5 },
            { i: "Goroutines", x: 6, y: 0, w: 6, h: 9, minW: 4, minH: 5 }
          ]
        },
        rowHeight: 60
      },
      charts: [
        {
          title: "Heap",
          type: "GMLineChart",
          data: {
            detailLines: [
              [
                { type: "string", value: "Garbage Collection Runs:" },
                {
                  type: "latest",
                  value: "go_metrics/runtime/total_gc_runs",
                  precision: 3
                }
              ],
              [
                { type: "string", value: "Total GC Pause:" },
                {
                  type: "latest",
                  value: "go_metrics/runtime/total_gc_pause_ns",
                  precision: 3,
                  baseUnit: "ns",
                  resultUnit: "ms"
                },
                { type: "string", value: "ms" }
              ]
            ],
            timeseries: [
              {
                type: "value",
                attribute: "go_metrics/runtime/alloc_bytes",
                label: "Go Heap Used (MB)",
                precision: 0,
                baseUnit: "B",
                resultUnit: "MB"
              },
              {
                type: "value",
                attribute: "go_metrics/runtime/sys_bytes",
                label: "Go Heap Size (MB)",
                precision: 0,
                baseUnit: "B",
                resultUnit: "MB"
              },
              {
                type: "value",
                attribute: "process/memory/used",
                label: "Process Memory Used (MB)",
                precision: 0,
                baseUnit: "B",
                resultUnit: "MB"
              }
            ]
          }
        },
        {
          title: "Goroutines",
          type: "GMLineChart",
          data: {
            timeseries: [
              {
                type: "value",
                attribute: "go_metrics/runtime/num_goroutines",
                label: "# of allocated goroutines"
              }
            ]
          }
        }
      ]
    }
  },
  fabric: {
    fabricPollingInterval: 5000,
    isPollingFabric: true,
    selectedInstanceID: "39ok57zwt7o0000000000",
    servicesPollingFailures: 0,
    selectedServiceSlug:
      "AAC Transfer Mail Sequential Message Job Up2 Information",
    selectedServiceVersion: "4.8",
    services: {
      "nachos-v1-0": {
        name: "Nachos",
        version: "1.0",
        slug: "nachos-v1-0",
        owner: "Team",
        capability: "Foods",
        minimum: 3,
        maximum: 0,
        documentation: "https://www.google.com",
        authorized: false,
        metered: true,
        threaded: true,
        runtime: "GO",
        instances: [
          {
            name: "ee0fa3669fea7e9a0adea649c46bca56",
            start_time: 1508854912461
          }
        ]
      },
      "grace-hopper-battleship-control-program-v1-0": {
        name: "Grace Hopper Battleship Control Program",
        version: "1.0",
        slug: "grace-hopper-battleship-control-program-v1-0",
        owner: "Export",
        capability: "System of Record",
        minimum: 1,
        maximum: 3,
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
      },
      "odrive-message-discovery-routing-system-v3-5": {
        name: "Odrive Message Discovery Routing System",
        version: "3.5",
        owner: "Remote",
        slug: "odrive-message-discovery-routing-system-v3-5",
        capability: "Crime Fighting",
        minimum: 4,
        maximum: 2,
        documentation: "https://www.google.com",
        authorized: true,
        metered: true,
        threaded: true,
        runtime: "JVM",
        instances: [
          { name: "ln2ukgrl79s000000000", start_time: 1294471930780 },
          { name: "6f0txv3yp000000000000", start_time: 322248748162 },
          { name: "3e4s03qdvyg0000000000", start_time: 548291905422 },
          { name: "5nypi0faq3k0000000000", start_time: 874529735616 }
        ]
      }
    }
  },
  instance: {
    instanceMetricsPollingInterval: 5000,
    isPollingInstanceMetrics: true,
    metricsPollingFailures: 0,
    metrics: {
      timestamps: [
        "1510699694557",
        "1510699699598",
        "1510699704508",
        "1510699709508",
        "1510699714507"
      ],
      "Total/requests": {
        1510699694557: 1193438,
        1510699699598: 1193438
      },
      "HTTP/requests": {
        1510699694557: 1193388,
        1510699699598: 1193388,
        1510699704508: 1193388
      },
      "HTTPS/requests": {
        1510699694557: 50,
        1510699699598: 50,
        1510699704508: 50,
        1510699709508: 50,
        1510699714507: 50
      },
      "function/CatalogStream/requests": {
        1510699694557: 13,
        1510699699598: 13,
        1510699704508: 13,
        1510699709508: 13,
        1510699714507: 13,
        1510699719507: 13
      },
      "function/CatalogStream/latency_ms.avg": {
        1510699694557: 1942.692308,
        1510699699598: 1942.692308,
        1510699704508: 1942.692308,
        1510699709508: 1942.692308,
        1510699714507: 1942.692308,
        1510699719507: 1942.692308,
        1510699724508: 1942.692308
      },
      "function/CatalogStream/latency_ms.count": {
        1510699694557: 13,
        1510699699598: 13,
        1510699704508: 13,
        1510699709508: 13
      },
      "function/CatalogStream/latency_ms.max": {
        1510699694557: 3484,
        1510699699598: 3484,
        1510699704508: 3484
      },
      "function/CatalogStream/latency_ms.min": {
        1510699694557: 600,
        1510699699598: 600,
        1510699704508: 600
      },
      "function/CatalogStream/latency_ms.sum": {
        1510699694557: 25255,
        1510699699598: 25255,
        1510699704508: 25255,
        1510699709508: 25255,
        1510699714507: 25255
      },
      "function/CatalogStream/latency_ms.p50": {
        1510699694557: 1956,
        1510699699598: 1956,
        1510699704508: 1956,
        1510699709508: 1956,
        1510699714507: 1956
      },
      "function/CatalogStream/latency_ms.p90": {
        1510699694557: 3469,
        1510699699598: 3469
      },
      "function/CatalogStream/latency_ms.p95": {
        1510699694557: 3484,
        1510699699598: 3484,
        1510699704508: 3484,
        1510699709508: 3484
      },
      "function/CatalogStream/latency_ms.p99": {
        1510699694557: 3484,
        1510699699598: 3484
      },
      "function/CatalogStream/latency_ms.p9990": {
        1510699694557: 3484,
        1510699699598: 3484,
        1510699704508: 3484
      },
      "function/CatalogStream/latency_ms.p9999": {
        1510699694557: 3484,
        1510699699598: 3484,
        1510699704508: 3484
      },
      "function/CatalogStream/errors.count": {
        1510699694557: 0,
        1510699699598: 0,
        1510699704508: 0,
        1510699709508: 0
      },
      "function/CatalogStream/in_throughput": {
        1510699694557: 227,
        1510699699598: 227,
        1510699704508: 227,
        1510699709508: 227
      },
      "function/CatalogStream/out_throughput": {
        1510699694557: 2889,
        1510699699598: 2889,
        1510699704508: 2889,
        1510699709508: 2889
      },
      "function/OrderItem/requests": {
        1510699694557: 13,
        1510699699598: 13,
        1510699704508: 13,
        1510699709508: 13,
        1510699714507: 13
      },
      "function/OrderItem/latency_ms.avg": {
        1510699694557: 2398.615385,
        1510699699598: 2398.615385,
        1510699704508: 2398.615385
      },
      "function/OrderItem/latency_ms.count": {
        1510699694557: 13,
        1510699699598: 13,
        1510699704508: 13
      },
      "function/OrderItem/latency_ms.max": {
        1510699694557: 3565,
        1510699699598: 3565,
        1510699704508: 3565
      },
      "function/OrderItem/latency_ms.min": {
        1510699694557: 1345,
        1510699699598: 1345,
        1510699704508: 1345
      },
      "function/OrderItem/latency_ms.sum": {
        1510699694557: 31182,
        1510699699598: 31182,
        1510699704508: 31182
      },
      "function/OrderItem/latency_ms.p50": {
        1510699694557: 2339,
        1510699699598: 2339,
        1510699704508: 2339
      },
      "function/OrderItem/latency_ms.p90": {
        1510699694557: 3476,
        1510699699598: 3476,
        1510699704508: 3476
      },
      "function/OrderItem/latency_ms.p95": {
        1510699694557: 3565,
        1510699699598: 3565,
        1510699704508: 3565,
        1510699709508: 3565,
        1510699829682: 3565
      },
      "function/OrderItem/latency_ms.p99": {
        1510699694557: 3565,
        1510699699598: 3565,
        1510699704508: 3565
      },
      "function/OrderItem/latency_ms.p9990": {
        1510699694557: 3565,
        1510699699598: 3565,
        1510699704508: 3565
      },
      "function/OrderItem/latency_ms.p9999": {
        1510699694557: 3565,
        1510699699598: 3565,
        1510699704508: 3565
      },
      "function/OrderItem/errors.count": {
        1510699694557: 0,
        1510699699598: 0,
        1510699704508: 0,
        1510699709508: 0
      },
      "function/OrderItem/in_throughput": {
        1510699694557: 225,
        1510699699598: 225,
        1510699704508: 225
      },
      "function/OrderItem/out_throughput": {
        1510699694557: 143,
        1510699699598: 143,
        1510699704508: 143
      }
    }
  },
  settings: {
    fabricServer: "http://localhost:1337",
    threadsFilter: "all"
  },
  threadsTable: []
};
