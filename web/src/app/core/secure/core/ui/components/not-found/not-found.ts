import { AiButton } from "@aiandralves/ai-ui";
import { NgOptimizedImage } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
    selector: "ai-not-found",
    imports: [AiButton, NgOptimizedImage, RouterLink],
    templateUrl: "./not-found.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {}
