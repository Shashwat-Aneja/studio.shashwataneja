import {readFileSync} from 'node:fs';
import {describe,it,expect} from 'vitest';
describe('review-only production rule',()=>{it('cannot be confused with an active broad production rule',()=>{const c=JSON.parse(readFileSync('docs/security/production-rate-limit.proposed.json','utf8'));expect(c.status).toBe('PREPARED_NOT_APPLIED');expect(c.ownerAuthorizedSubjectToSafetyVerification).toBe(true);expect(c.environment).toBe('ANY_FOR_THIS_EXACT_HOST');expect(c.match).toEqual({host:'studio.shashwataneja.com',method:'POST',path:'/api/booking-request'});expect(c.rate).toEqual({requests:20,windowSeconds:60,key:'source_ip',algorithm:'fixed_window'});expect(c.rollout.initialAction).toBe('log');expect(c.rollout.rejectionStatus).toBe(429);});});

it('records feature Git-deployment suppression without claiming manual deployment isolation',()=>{const c=JSON.parse(readFileSync('vercel.json','utf8'));expect(c.git.deploymentEnabled).toEqual({'feature/studio-foundation':false,'release/studio-production-2026-11-14':false});});

it('keeps release candidate Git pushes deployment-disabled while publication is on hold',()=>{const c=JSON.parse(readFileSync('vercel.json','utf8'));expect(c.git.deploymentEnabled['release/studio-production-2026-11-14']).toBe(false);});
