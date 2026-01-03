import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'accountType'
})
export class AccountTypePipe implements PipeTransform {
  transform(type: any, mode: 'label' | 'norm' = 'norm'): string {
    if (type === null || type === undefined) {
      return mode === 'label' ? 'Unknown' : 'UNKNOWN';
    }
    const t = String(type).toUpperCase();
    // Catch variants like "Saving", "SavingAccount", "SavingBankAccountDTO", "SAVING"
    if (t.includes('SAV') || t.includes('SAVING')) return mode === 'label' ? 'Saving' : 'SAVING';
    if (t.includes('CURRENT')) return mode === 'label' ? 'Current' : 'CURRENT';
    return mode === 'label' ? String(type) : String(type).toUpperCase();
  }
}
