import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeMeaningfulAnswer as normalize } from '../runtime/practice-normalize';

test('Module 4 accepts harmless formatting while preserving operational meaning',()=>{
 assert.equal(normalize('  Carrier approval,   pending. '),normalize('carrier approval pending'));
 assert.equal(normalize('$2,400'),normalize('$2400'));
 for(const [a,b] of [['1.50','150'],['15:30','1530'],['9 AM','9 PM'],['approved','not approved'],['load 601','load 610'],['60 USD','60 EUR'],['4/5','45'],['15:30 Central','15:30 Eastern']])assert.notEqual(normalize(a),normalize(b),`${a} vs ${b}`);
});
