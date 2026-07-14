import {
    AiAvatar,
    AiBadge,
    AiButton,
    AiIcon,
    AiMenuContent,
    AiMenuDirective,
    AiMenuItem,
    AiMenuLabel,
    AiSeparator,
} from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { DurationPipe, SessionFacade } from "@core/secure";

@Component({
    selector: "ai-navbar",
    imports: [
        AiAvatar,
        AiMenuContent,
        AiMenuDirective,
        AiMenuItem,
        AiMenuLabel,
        AiIcon,
        AiSeparator,
        AiButton,
        AiBadge,
        DurationPipe,
    ],
    templateUrl: "./navbar.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
    #sessionFacade = inject(SessionFacade);

    readonly userDisplayName = this.#sessionFacade.userDisplayName;
    readonly userInitials = this.#sessionFacade.userInitials;
    readonly expiration = this.#sessionFacade.expiration;
    readonly theme = this.#sessionFacade.theme;
    readonly user = computed(() => this.#sessionFacade.session()?.user);

    onOpenProfile() {
        this.#sessionFacade.openProfileDialog();
    }

    onLogout() {
        this.#sessionFacade.confirmSignOut();
    }

    onChangeTheme() {
        this.#sessionFacade.onChangeTheme();
    }
}
