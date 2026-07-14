import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "duration",
})
export class DurationPipe implements PipeTransform {
    transform(time: number): string {
        if (time <= 0) return "00:00";

        const hours = this._addZeroLeft(Math.floor(time / 3600000));
        const minutes = this._addZeroLeft(Math.floor((time % 3600000) / 60000));
        const seconds = this._addZeroLeft(Math.floor((time % 60000) / 1000));

        return Number(hours) > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
    }

    private _addZeroLeft(value: number): string {
        return value < 10 ? "0" + value : value.toString();
    }
}
