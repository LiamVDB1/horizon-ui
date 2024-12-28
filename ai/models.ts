import {createVertex } from '@ai-sdk/google-vertex';
import {createOpenAI} from "@ai-sdk/openai";

// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

//process.env.GOOGLE_APPLICATION_CREDENTIALS = '/Users/liamvdb/PycharmProjects/Jupiter Horizon/betajupiterhorizon-946d007aad33.json';
require('dotenv').config();

export const vertex = createVertex({
  project: "betajupiterhorizon",
  location: "us-central1",
  //location: "europe-west1",
})

export const openai = createOpenAI();

export const models: Array<Model> = [
  {
    id: 'gemini-1.5-pro-002',
    label: 'Gemini 1.5 Pro',
    apiIdentifier: 'gemini-1.5-pro-002',
    description: 'For complex, multi-step tasks',
  },
  {
    id: 'gemini-2.0-flash-exp',
    label: 'Gemini 2.0 Flash',
    apiIdentifier: 'gemini-2.0-flash-exp',
    description: 'Experimental, for fast, complex tasks',
  },
  {
    id : 'gemini-1.5-flash-002',
    label: 'Gemini 1.5 Flash',
    apiIdentifier: 'gemini-1.5-flash-002',
    description: 'For fast, lightweight tasks',
  },
  {
    id: 'gpt-4o-mini',
    label: 'GPT 4o mini',
    apiIdentifier: 'gpt-4o-mini',
    description: 'Small model for fast, lightweight tasks',
  },
  {
    id: 'gpt-4o',
    label: 'GPT 4o',
    apiIdentifier: 'gpt-4o',
    description: 'For complex, multi-step tasks',
  },
] as const;


//export const DEFAULT_MODEL_NAME: string = 'gemini-1.5-flash-002';
export const DEFAULT_MODEL_NAME: string = 'gemini-2.0-flash-exp';
//export const DEFAULT_MODEL_NAME: string = 'gemini-1.5-pro-002';
export const FALLBACK_MODEL_NAME: string = 'gpt-4o-mini';
