import { AiBadge, AiButton, AiCarousel, AiCarouselItem, AiSkeleton } from "@aiandralves/ai-ui";
import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import { NavbarComponent } from "./components/navbar/navbar";

@Component({
    selector: "ai-leading",
    imports: [AiBadge, AiCarousel, AiCarouselItem, NavbarComponent, AiButton, DatePipe, AiSkeleton],
    templateUrl: "./leading.page.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadingPage {
    protected readonly date = new Date();
    readonly emptys = signal([{ id: 1 }, { id: 2 }, { id: 3 }]);
}
