import { NextResponse } from 'next/server';
import * as dns from 'dns/promises';
import { Resolver } from 'dns/promises';

const RECORD_TYPES = ['A', 'AAAA', 'MX', 'TXT', 'CNAME', 'NS', 'SOA'] as const;
type RecordType = typeof RECORD_TYPES[number];

// Extended types to include TTL
interface ExtendedDnsRecord {
  ttl?: number;
  type: string;
  [key: string]: any;
}

function isValidDomain(domain: string) {
  const pattern = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
  return pattern.test(domain);
}

async function resolveDNS(domain: string, type: RecordType) {
  const resolver = new Resolver();
  resolver.setServers(['8.8.8.8']); // Use Google's DNS server for consistent results

  try {
    switch (type) {
      case 'A': {
        const records = await resolver.resolve4(domain);
        const anyRecords = (await resolver.resolveAny(domain)) as ExtendedDnsRecord[];
        const aRecords = anyRecords.filter(r => r.type === 'A');
        return records.map((ip, index) => ({
          type: 'A',
          name: domain,
          value: ip,
          ttl: aRecords[index]?.ttl || 300
        }));
      }
      case 'AAAA': {
        const records = await resolver.resolve6(domain);
        const anyRecords = (await resolver.resolveAny(domain)) as ExtendedDnsRecord[];
        const aaaaRecords = anyRecords.filter(r => r.type === 'AAAA');
        return records.map((ip, index) => ({
          type: 'AAAA',
          name: domain,
          value: ip,
          ttl: aaaaRecords[index]?.ttl || 300
        }));
      }
      case 'MX': {
        const records = await resolver.resolveMx(domain);
        const anyRecords = (await resolver.resolveAny(domain)) as ExtendedDnsRecord[];
        const mxRecords = anyRecords.filter(r => r.type === 'MX');
        return records.map((record, index) => ({
          type: 'MX',
          name: domain,
          value: record.exchange,
          priority: record.priority,
          ttl: mxRecords[index]?.ttl || 300
        }));
      }
      case 'TXT': {
        const records = await resolver.resolveTxt(domain);
        const anyRecords = (await resolver.resolveAny(domain)) as ExtendedDnsRecord[];
        const txtRecords = anyRecords.filter(r => r.type === 'TXT');
        return records.map((txt, index) => ({
          type: 'TXT',
          name: domain,
          value: Array.isArray(txt) ? txt.join(' ') : txt,
          ttl: txtRecords[index]?.ttl || 300
        }));
      }
      case 'CNAME': {
        const records = await resolver.resolveCname(domain);
        const anyRecords = (await resolver.resolveAny(domain)) as ExtendedDnsRecord[];
        const cnameRecords = anyRecords.filter(r => r.type === 'CNAME');
        return records.map((target, index) => ({
          type: 'CNAME',
          name: domain,
          value: target,
          ttl: cnameRecords[index]?.ttl || 300
        }));
      }
      case 'NS': {
        const records = await resolver.resolveNs(domain);
        const anyRecords = (await resolver.resolveAny(domain)) as ExtendedDnsRecord[];
        const nsRecords = anyRecords.filter(r => r.type === 'NS');
        return records.map((nameserver, index) => ({
          type: 'NS',
          name: domain,
          value: nameserver,
          ttl: nsRecords[index]?.ttl || 300
        }));
      }
      case 'SOA': {
        const record = await resolver.resolveSoa(domain);
        const anyRecords = (await resolver.resolveAny(domain)) as ExtendedDnsRecord[];
        const soaRecord = anyRecords.find(r => r.type === 'SOA');
        return [{
          type: 'SOA',
          name: domain,
          value: `Primary NS: ${record.nsname}, Responsible: ${record.hostmaster}, Serial: ${record.serial}, Refresh: ${record.refresh}, Retry: ${record.retry}, Expire: ${record.expire}, TTL: ${record.minttl}`,
          ttl: soaRecord?.ttl || 300
        }];
      }
      default:
        return [];
    }
  } catch (error) {
    console.error(`Error resolving ${type} records for ${domain}:`, error);
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const { domain, types = RECORD_TYPES } = await request.json();

    if (!domain || !isValidDomain(domain)) {
      return NextResponse.json(
        { error: 'Invalid domain name' },
        { status: 400 }
      );
    }

    const results: Record<string, any[]> = {};

    for (const type of types) {
      try {
        const records = await resolveDNS(domain, type as RecordType);
        results[type] = records;
        console.log(`${type} records for ${domain}:`, records);
      } catch (error) {
        console.error(`Error processing ${type} records for ${domain}:`, error);
        results[type] = [];
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('DNS lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to perform DNS lookup' },
      { status: 500 }
    );
  }
} 