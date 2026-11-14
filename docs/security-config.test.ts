import {readFileSync} from 'node:fs';
import {describe,it,expect} from 'vitest';
describe('review-only production rule',()=>{it('cannot be confused with an active broad production rule',()=>{const c=JSON.parse(readFileSync('docs/security/production-rate-limit.proposed.json','utf8'));expect(c.status).toBe('DRAFT_NOT_APPLIED');expect(c.requiresExplicitProductionApproval).toBe(true);expect(c.environment).toBe('production');expect(c.match).toEqual({method:'POST',path:'/api/booking-request'});expect(c.rate).toEqual({requests:20,windowSeconds:60,key:'source_ip',algorithm:'fixed_window'});expect(c.rollout.initialAction).toBe('log');expect(c.rollout.rejectionStatus).toBe(429);});});

it('prevents feature pushes from assigning the linked public domain',()=>{const c=JSON.parse(readFileSync('vercel.json','utf8'));expect(c.git.deploymentEnabled).toEqual({'feature/studio-foundation':false});});
