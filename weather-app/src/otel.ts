// src/otel.ts
// import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
// import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
// import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
// import { registerInstrumentations } from '@opentelemetry/instrumentation';
// import { resourceFromAttributes  } from '@opentelemetry/resources';
// import { trace, context } from '@opentelemetry/api';

// const exporter = new OTLPTraceExporter({
//   url: 'http://localhost:4317', // OTLP endpoint
// });

// const provider = new WebTracerProvider({
//   resource: resourceFromAttributes({
//     'service.name': 'weather-app-frontend',
//   }),
//     spanProcessors: [new SimpleSpanProcessor(exporter)]
// });


// provider.register();

// OPTIONAL: for auto instrumentation (e.g., fetch, document load)
// registerInstrumentations({
//   instrumentations: [new FetchInstrumentation(), new DocumentLoadInstrumentation()],
// });
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from '@opentelemetry/core';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

export const FrontendTracer = async () => {
  const { ZoneContextManager } = await import('@opentelemetry/context-zone');

  const exporter = new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces', // OTLP endpoint
  });
  const provider = new WebTracerProvider({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: 'weather-app-frontend',
    }),
    spanProcessors: [new SimpleSpanProcessor(exporter)],
  });

  const contextManager = new ZoneContextManager();

  provider.register({
    contextManager,
    propagator: new CompositePropagator({
      propagators: [
        new W3CBaggagePropagator(),
        new W3CTraceContextPropagator(),
      ],
    }),
  });

  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [
      getWebAutoInstrumentations({
        '@opentelemetry/instrumentation-fetch': {
          propagateTraceHeaderCorsUrls: /.*/,
          clearTimingResources: true,
          applyCustomAttributesOnSpan(span:any) {
            console.log('[otel] Created span:', span.name);
            span.setAttribute('app.synthetic_request', 'false');
          },
        },
      }),
    ],
  });
};
