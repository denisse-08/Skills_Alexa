/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const axios = require('axios');
const sprintf = require('i18next-sprintf-postprocessor');
var persistenceAdapter = getPersistenceAdapter();



function getPersistenceAdapter() {
    // This function is an indirect way to detect if this is part of an Alexa-Hosted skill
    function isAlexaHosted() {
        return process.env.S3_PERSISTENCE_BUCKET ? true : false;
    }
    const tableName = 'clima_table';
    if(isAlexaHosted()) {
        const {S3PersistenceAdapter} = require('ask-sdk-s3-persistence-adapter');
        return new S3PersistenceAdapter({ 
            bucketName: process.env.S3_PERSISTENCE_BUCKET
        });
    } else {
        // IMPORTANT: don't forget to give DynamoDB access to the role you're to run this lambda (IAM)
        const {DynamoDbPersistenceAdapter} = require('ask-sdk-dynamodb-persistence-adapter');
        return new DynamoDbPersistenceAdapter({ 
            tableName: tableName,
            createTable: true
        });
    }
}
const moment = require('moment-timezone');
const DOCUMENT_ID1 = "hola";
const DOCUMENT_ID2 = "informacion";
const DOCUMENT_ID3 = "ayuda";
const DOCUMENT_ID4 = "cancelar";
const DOCUMENT_ID = "clima";
const datasource = {
    "detailImageRightData": {
        "type": "object",
        "objectId": "detailImageRightSample",
        "backgroundImage": {
            "contentDescription": null,
            "smallSourceUrl": null,
            "largeSourceUrl": null,
            "sources": [
                {
                    "url": "https://www.lavanguardia.com/files/content_image_mobile_filter/uploads/2021/07/20/60f6c971bc94a.jpeg",
                    "size": "large"
                }
            ]
        },
        "title": "Golpe de calor",
        "image": {
            "contentDescription": "",
            "smallSourceUrl": null,
            "largeSourceUrl": null,
            "sources": [
                {
                    "url": "https://img.freepik.com/vector-gratis/ilustracion-plana-calor-verano-hombre-sudando-sol_23-2149433187.jpg?w=2000",
                    "size": "large"
                }
            ]
        },
        "textContent": {
            "primaryText": {
                "type": "PlainText",
                "text": "Bienvenido"
            },
            "locationText": {
                "type": "PlainText",
                "text": "Hablaremos sobre el golpe de calor<br />Que es?, sintomas y  <br />Como prevenirlo"
            }
        }
    },
    "gridListData": {
        "headerTitle": "Golpe de Calor",
        "headerSubtitle": "Header subtitle",
        "headerAttributionImage": "https://s3.amazonaws.com/ask-skills-assets/apl-layout-assets/attribution_dark_hub_prime.png",
        "backgroundImageSource": "https://d2o906d8ln7ui1.cloudfront.net/images/BT6_Background.png",
        "defaultImageSource": "https://d2o906d8ln7ui1.cloudfront.net/images/BT7_Background.png",
        "hintText": "Alexa image list footer hint text",
        "listItemsToShow": [
            {
                "imageSource": "https://www.tupolizadesalud.com/blog/wp-content/uploads/2022/07/42%C2%BAC-1024x577.jpg",
                "imageProgressBarPercentage": 90,
                "imageShowProgressBar": false,
                "ratingSlotMode": "multiple"
            },
            {
                "imageSource": "https://www.fuden.es/wp-content/uploads/2018/07/infografia_calor_golpe.png",
                "ratingSlotMode": "multiple"
            },
            {
                "imageSource": "https://www.desnivel.com/images/2017/07/golpe-de-calor-grandes_espacios_234_20170628.png",
                "ratingSlotMode": "multiple"
            }
        ]
    },
    "ayuda": {
        "type": "object",
        "objectId": "detailImageRightSample",
        "backgroundImage": {
            "contentDescription": null,
            "smallSourceUrl": null,
            "largeSourceUrl": null,
            "sources": [
                {
                    "url": "https://www.lavanguardia.com/files/content_image_mobile_filter/uploads/2021/07/20/60f6c971bc94a.jpeg",
                    "size": "large"
                }
            ]
        },
        "title": "Golpe de calor",
        "color": "blue",
        "image": {
            "contentDescription": "",
            "smallSourceUrl": null,
            "largeSourceUrl": null,
            "sources": [
                {
                    "url": "https://www.salus-seguros.com/resize/golpe-de-calor-tratamiento.jpg",
                    "size": "large"
                }
            ]
        },
        "textContent": {
            "primaryText": {
                "type": "PlainText",
                "text": "Ayudaa"
            },
            "locationText": {
                "type": "PlainText",
                "text": "¡Hola! Llama al 911"
            }
        }
    },
    "cancelar": {
        "type": "object",
        "objectId": "detailImageRightSample",
        "backgroundImage": {
            "contentDescription": null,
            "smallSourceUrl": null,
            "largeSourceUrl": null,
            "sources": [
                {
                    "url": "https://www.lavanguardia.com/files/content_image_mobile_filter/uploads/2021/07/20/60f6c971bc94a.jpeg",
                    "size": "large"
                }
            ]
        },
        "title": "Golpe de calor",
        "backgroundcolor": "green",
        "image": {
            "contentDescription": "",
            "smallSourceUrl": null,
            "largeSourceUrl": null,
            "sources": [
                {
                    "url": "https://noembed.com/i/https://media.giphy.com/media/26BREnyYXsPOxlUKk/giphy.gif",
                    "size": "large"
                }
            ]
        },
        "textContent": {
            "primaryText": {
                "type": "PlainText",
                "text": "Cancelaste"
            },
            "locationText": {
                "type": "PlainText",
                "text": "¡Hasta luego! no olvides cuidarte"
            }
        }
    },
    "temperatura": {
        "temp": "25",
        "temMin": "19",
        "temMax": "29",
        "imagenSource": "https://cdn.icon-icons.com/icons2/715/PNG/512/rain_icon-icons.com_62252.png",
        "pie": "Desarrollado por Denisse Hernandez San Juan"
    }
};

const createDirectivePayload = (aplDocumentId, dataSources = {}, tokenId = "documentToken") => {
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        token: tokenId,
        document: {
            type: "Link",
            src: "doc://alexa/apl/documents/" + aplDocumentId
        },
        datasources: dataSources
    }
};

i18n.use(sprintf).init({
  lng: 'es', // Establece el idioma predeterminado
  resources: {
    es: {
      translation: {
        WELCOME_MSG: 'Hola, el día de hoy aprenderemos qué es un golpe de calor, los síntomas y cómo cuidarnos. Prueba diciendo "me puedes informar sobre el golpe de calor" o "cuáles son los síntomas del golpe de calor, tambien puedes pedirme el clima diciendo: Dame el clima".',
        HELLO: 'Hola, el día de hoy aprenderemos qué es un golpe de calor, los síntomas y cómo cuidarnos.',
        SAVED_WEATHER: "El clima guardado es:",
        HEAT_STROKE_INFO: 'El golpe de calor es una condición peligrosa que ocurre cuando el cuerpo se sobrecalienta debido a la exposición excesiva al calor. Los síntomas incluyen mareos, fatiga, dolor de cabeza y deshidratación. Para protegerte del golpe de calor, asegúrate de mantenerte hidratado, usar ropa ligera y protegerte del sol.',
        SYMPTOMS: 'Los síntomas del golpe de calor incluyen mareos, fatiga, dolor de cabeza y deshidratación.',
        PROTECTION: 'Para protegerte del golpe de calor, asegúrate de mantenerte hidratado, usar ropa ligera y protegerte del sol.',
        RES_CLIMA1:" la temperatura es",
        RES_CLIMA2:" grados Celsius, con una temperatura minima de:",
        RES_CLIMA3:" grados Celsius, y una temperatura maxima de:",
        RES_CLIMA4:" grados Celsius.",
        HELP_MSG: 'Puedes pedirme información sobre el golpe de calor.',
        GOODBYE_MSG: '¡Hasta luego, no olvides cuidarte!',
        TEMPERATURE_MSG: "La temperatura es {temperature} grados Celsius, con una temperatura mínima de {temperatureMin} grados Celsius, y una temperatura máxima de {temperatureMax} grados Celsius.",
        HOT_WEATHER_INSTRUCTIONS : "¡Hace mucho calor! Asegúrate de mantenerte hidratado y usar ropa ligera para mantenerte fresco.",
        WARM_WEATHER_INSTRUCTIONS : "El clima está templado. Usa ropa cómoda y disfruta del día.",
        MODERATE_WEATHER_INSTRUCTIONS: "El clima es agradable. Considera llevar una chaqueta ligera para las noches frescas.",
        COLD_WEATHER_INSTRUCTIONS_ES:"Hace frío. Abrígate bien con capas de ropa y mantente caliente."
        
      }
    },
    en: {
      translation: {
        WELCOME_MSG: 'Hello, today we will learn about heatstroke, its symptoms, and how to take care of ourselves. Try saying "can you inform about heat stroke" or "what are the symptoms for heat stroke" You can also ask me for the weather by saying: "Give me the weather.',
        HELLO: 'Hello, today we will learn what heat stroke is, the symptoms, and how to take care of ourselves.',
        SAVED_WEATHER: "The saved weather is:",
        HEAT_STROKE_INFO: 'Heat stroke is a dangerous condition that occurs when the body overheats due to excessive heat exposure. Symptoms include dizziness, fatigue, headache, and dehydration. To protect yourself from heat stroke, make sure to stay hydrated, wear lightweight clothing, and seek shade from the sun.',
        SYMPTOMS: 'The symptoms of heat stroke include dizziness, fatigue, headache, and dehydration.',
        PROTECTION: 'To protect yourself from heat stroke, make sure to stay hydrated, wear lightweight clothing, and seek shade from the sun.',
        RES_CLIMA1:"The temperature is",
        RES_CLIMA2:" degrees Celsius, with a minimum temperature of: ",
        RES_CLIMA3:" degrees Celsius, and a maximum temperature of:",
        RES_CLIMA4:" degrees Celsius.",
        HELP_MSG: 'You can ask me for information about heat stroke.',
        GOODBYE_MSG: 'Goodbye!',
        HOT_WEATHER_INSTRUCTIONS :"It's very hot! Make sure to stay hydrated and wear light clothing to keep cool.",
        WARM_WEATHER_INSTRUCTIONS: "The weather is warm. Wear comfortable clothing and enjoy the day.",
        MODERATE_WEATHER_INSTRUCTIONS: "The weather is pleasant. Consider bringing a light jacket for cooler evenings.",
        COLD_WEATHER_INSTRUCTIONS: "It's cold outside. Bundle up with layers of clothing and stay warm."
      }
    }
  }
});


const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();

    // Verificar si hay datos previamente guardados en la sesión
    if (sessionAttributes.hasOwnProperty('clima')) {
      const climaGuardado = sessionAttributes.clima;

      const requestLocale = handlerInput.requestEnvelope.request.locale;
      const i18nInstance = i18n.cloneInstance();
      i18nInstance.changeLanguage(requestLocale);

      const speakOutput = i18nInstance.t('WELCOME_MSG') + ` ${i18nInstance.t('SAVED_WEATHER')} ${climaGuardado}`;

      return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    }

    const requestLocale = handlerInput.requestEnvelope.request.locale;
    const i18nInstance = i18n.cloneInstance();
    i18nInstance.changeLanguage(requestLocale);

    const speakOutput = i18nInstance.t('WELCOME_MSG');

    // Guardar el clima en la sesión para recordarlo en futuras solicitudes
    sessionAttributes.clima = speakOutput;
    attributesManager.setSessionAttributes(sessionAttributes);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};


const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HolaIntento';
    },
    handle(handlerInput) {
        const speakOutput = i18n.t('HELLO');
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID1, datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};


const GolpeDeCalor = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'informacion';
    },
    handle(handlerInput) {
    const requestLocale = handlerInput.requestEnvelope.request.locale;
    const i18nInstance = i18n.cloneInstance();
    i18nInstance.changeLanguage(requestLocale);

    const info = handlerInput.requestEnvelope.request.intent.slots.accion.value;
    let respuesta;

    if (info === 'informame' || info === 'inform') {
      respuesta = i18nInstance.t('HEAT_STROKE_INFO');
    } else if (info === 'sintomas' || info === 'symptoms') {
      respuesta = i18nInstance.t('SYMPTOMS');
    } else if (info === 'protegerse' || info === 'protect') {
      respuesta = i18nInstance.t('PROTECTION');
    } else {
      respuesta = i18nInstance.t('HEAT_STROKE_INFO');
    }

    if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
      const aplDirective = createDirectivePayload(DOCUMENT_ID2, datasource);
      handlerInput.responseBuilder.addDirective(aplDirective);
    }

    return handlerInput.responseBuilder
      .speak(respuesta)
      .getResponse();
  }
};

const ClimaIntentHandler = {
  async canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'ClimaIntent';
  },
  async handle(handlerInput) {
    const requestLocale = handlerInput.requestEnvelope.request.locale;
    const i18nInstance = i18n.getFixedT(requestLocale);

    const url = 'https://www.meteosource.com/api/v1/free/point?lat=20.96250&lon=-98.56667&sections=daily&timezone=auto&language=en&units=auto&key=9kuk3pm6w4s23zk66szg71x5gaxa2wrvv2vbttsm';

    try {
      const response = await axios.get(url);
      const { data } = response;

      if (data && data.daily && data.daily.data && data.daily.data.length > 0) {
        const forecast = data.daily.data[0];
        const day = forecast.day;
        const temperature = forecast.all_day.temperature;
        const temperatureMin = forecast.all_day.temperature_min;
        const temperatureMax = forecast.all_day.temperature_max;
        
        
        const datasource = {
        temperatura: {
        temp: temperature.toString(),
         temMin: temperatureMin.toString(),
         temMax: temperatureMax.toString(),
         imagenSource: "https://cdn.icon-icons.com/icons2/715/PNG/512/rain_icon-icons.com_62252.png",
          pie: "Desarrollado por Denisse Hernandez San Juan"
        }
      };
      
        let instrucciones;
        if (temperature >= 30) {
          instrucciones = i18nInstance('HOT_WEATHER_INSTRUCTIONS');
        } else if (temperature >= 20) {
          instrucciones = i18nInstance('WARM_WEATHER_INSTRUCTIONS');
        } else if (temperature >= 10) {
          instrucciones = i18nInstance('MODERATE_WEATHER_INSTRUCTIONS');
        } else {
          instrucciones = i18nInstance('COLD_WEATHER_INSTRUCTIONS');
        }
        const speechOutput = `El pronóstico para hoy ` + `${day}` + i18nInstance('RES_CLIMA1') + ` ${temperature}` + i18nInstance('RES_CLIMA2') + ` ${temperatureMin}` + i18nInstance('RES_CLIMA3') + ` ${temperatureMax}` + i18nInstance('RES_CLIMA4') + instrucciones;

        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID, datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.clima = speechOutput;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder.speak(speechOutput).getResponse();
      } else {
        return handlerInput.responseBuilder.speak(i18nInstance('GOODBYE_MSG')).getResponse();
      }
    } catch (error) {
      console.error('Error al obtener la información del clima:', error);
      return handlerInput.responseBuilder.speak(i18nInstance('GOODBYE_MSG')).getResponse();
    }
  },
};



const HelpIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const requestLocale = handlerInput.requestEnvelope.request.locale;
    const i18nInstance = i18n.getFixedT(requestLocale);
    
    if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            const ayudaDatasource = {
  ayuda: {
    type: "object",
    objectId: "detailImageRightSample",
    backgroundImage: {
      contentDescription: null,
      smallSourceUrl: null,
      largeSourceUrl: null,
      sources: [
        {
          url: "https://www.lavanguardia.com/files/content_image_mobile_filter/uploads/2021/07/20/60f6c971bc94a.jpeg",
          size: "large"
        }
      ]
    },
    title: "Golpe de calor",
    color: "blue",
    image: {
      contentDescription: "",
      smallSourceUrl: null,
      largeSourceUrl: null,
      sources: [
        {
          url: "https://www.salus-seguros.com/resize/golpe-de-calor-tratamiento.jpg",
          size: "large"
        }
      ]
    },
    textContent: {
      primaryText: {
        type: "PlainText",
        text: "Ayuda"
      },
      locationText: {
        type: "PlainText",
        text: "¡Hola! Llama al 911"
      },
      helpText: {
        type: "PlainText",
        text: "Aquí está la ayuda que necesitas: {HELP_MSG}"
      }
    }
  }
};

            const aplDirective = createDirectivePayload(DOCUMENT_ID3, datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
    }
    const speakOutput = i18nInstance('HELP_MSG');

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent' ||
        Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const requestLocale = handlerInput.requestEnvelope.request.locale;
    const i18nInstance = i18n.getFixedT(requestLocale);

    const speakOutput = i18nInstance('GOODBYE_MSG');

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const LoadAttributesRequestInterceptor = {
    async process(handlerInput) {
        if(handlerInput.requestEnvelope.session['new']){ //is this a new session?
            const {attributesManager} = handlerInput;
            const persistentAttributes = await attributesManager.getPersistentAttributes() || {};
            //copy persistent attribute to session attributes
            handlerInput.attributesManager.setSessionAttributes(persistentAttributes);
        }
    }
};

const SaveAttributesResponseInterceptor = {
    async process(handlerInput, response) {
        const {attributesManager} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const shouldEndSession = (typeof response.shouldEndSession === "undefined" ? true : response.shouldEndSession);//is this a session end?
        if(shouldEndSession || handlerInput.requestEnvelope.request.type === 'SessionEndedRequest') { // skill was stopped or timed out            
            attributesManager.setPersistentAttributes(sessionAttributes);
            await attributesManager.savePersistentAttributes();
        }
    }
};



/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        GolpeDeCalor,
        ClimaIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler).addRequestInterceptors(
            LoadAttributesRequestInterceptor)
        .addResponseInterceptors(
            SaveAttributesResponseInterceptor)
        .withPersistenceAdapter(persistenceAdapter)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();