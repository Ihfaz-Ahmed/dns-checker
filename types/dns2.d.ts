declare module 'dns2' {
  export interface DNSAnswer {
    name: string;
    type: string;
    class: number;
    ttl: number;
    data: any;
    priority?: number;
  }

  export interface DNSResponse {
    answers: DNSAnswer[];
  }

  export default class DNS2 {
    resolve(domain: string, type: string): Promise<DNSResponse>;
  }
} 