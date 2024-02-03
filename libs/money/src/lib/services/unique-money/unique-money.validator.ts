import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { MoneyService } from '../money.service';
import { Money, PRICE_MARGIN } from '@crown/data';

@Injectable({
  providedIn: 'root',
})
export class UniqueMoneyValidator implements AsyncValidator {
  private _existingDataSubj = new BehaviorSubject<Partial<Money>>({});
  existingData$: Observable<Partial<Money>> = this._existingDataSubj.asObservable();

  get existingData() {
    return this._existingDataSubj.value;
  }

  constructor(private moneyService: MoneyService) {}

  validate(
    control: AbstractControl<any, any>
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const { createdAt, type, price, userId } = control.value;

    const existingMoney = this.moneyService.money.map((m) => ({
      createdAt: m.createdAt,
      price: m.price,
      type: m.type,
      userId: m.userId,
      fromWho: m.fromWho
    }));

    const doesExist = existingMoney.some((money) => {
      const existingCreatedAt = toDateString(money.createdAt)
      const formCreatedAt = toDateString(createdAt)

      const result =
        // money.userId === userId &&
        existingCreatedAt === formCreatedAt &&
        Math.abs(money.price - price) <= PRICE_MARGIN &&
        money.type === type;

      if (result) {
        this._existingDataSubj.next(money);
      }

      return result;
    });

    const response: any = doesExist ? { existingData: this.existingData } : null;

    return of(response).pipe(
      // delay(500),
      tap((validation) => {
        if (validation) {
          console.log('validation', validation);
        }
      })
    );
  }

  registerOnValidatorChange?(fn: () => void): void {}
}

function toDateString(date: Date | string) {
  let createdAtVal = date instanceof Date ? date : new Date(date);
  createdAtVal.setHours(12, 0, 0, 0);
  return createdAtVal?.toISOString()?.slice(0, 10);
}
