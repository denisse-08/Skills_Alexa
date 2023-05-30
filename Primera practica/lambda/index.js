/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

const PokemonFacts = {
  pikachu: [
    "Según revelaron los diseñadores de la empresa creadora del juego, Ken Sugimori y Atsuko Nishida en una entrevista al medio Yomiuri Shimbun , Pikachu es una ardilla.",
    "Los Pokémon eléctricos como Pikachu son superefectivos contra los Pokémon de tipo agua y volador y por la contra, además son débiles contra los de tipo tierra.",
    "Cuando se enfada, este Pokémon descarga la energía que almacena en el interior de las bolsas de las mejillas. Un golpe con su cola en forma de rayo puede propinar al rival una descarga eléctrica con una intensidad comparable a la de un relámpago.",
  ],
  charizard: [
    "Según revelaron los diseñadores de la empresa creadora del juego, Ken Sugimori y Atsuko Nishida en una entrevista al medio Yomiuri Shimbun , Pikachu es una ardilla.",
    "Los Pokémon eléctricos como Pikachu son superefectivos contra los Pokémon de tipo agua y volador y por la contra, además son débiles contra los de tipo tierra.",
    "Cuando se enfada, este Pokémon descarga la energía que almacena en el interior de las bolsas de las mejillas. Un golpe con su cola en forma de rayo puede propinar al rival una descarga eléctrica con una intensidad comparable a la de un relámpago.",
  ],
  charmander: [
    "Prefiere las cosas calientes. Dicen que cuando llueve le sale vapor de la punta de la cola.",
    
  ],
  bulbasaur:[
    " Lleva la semilla de una planta en su espalda desde que nace, la semilla crece lentamente.",
    
  ],
  Bidoof:[
    " Bidoof evoluciona a Bibarel al nivel 15. Starly evoluciona a Staravia al nivel 14 y a Staraptor al nivel 24.",
    "Bidoof, el Pokémon ratón gordito. Roe árboles y piedras con sus fuertes dientes delanteros y vive en guaridas cerca del agua.",
    
  ],
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Hola bienvenido, soy tu asistente, puedo darte algunos datos sobre diferentes pokemones,por ejemplo prueba diciendo Charizard'

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const Custom_Pokemon= {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "Custom_Pokemon"
    );
  },
  handle(handlerInput) {
    const { pokemon } = handlerInput.requestEnvelope.request.intent.slots;
    let response;
    if (pokemon && PokemonFacts[pokemon.value]) {
      response =
        PokemonFacts[pokemon.value][
          Math.floor(Math.random() * PokemonFacts[pokemon.value].length)
        ];
    } else {
      response =
        "No tengo información sobre el pokemon que has mencionado, prueba con otro";
    }
    return handlerInput.responseBuilder
      .speak(response)
      .reprompt(response)
      .getResponse();
  },
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = '¡Puedes saludarme! ¿Cómo puedo ayudar?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

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

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        Custom_Pokemon,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();