import { Directive, ElementRef, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appScrollToBottom]',
})
export class ScrollToBottomDirective implements OnDestroy {
  private hostMutationObserver: MutationObserver;

  constructor(hostElRef: ElementRef<HTMLElement>) {
    this.hostMutationObserver = new MutationObserver(() => {
      hostElRef.nativeElement.lastElementChild?.scrollIntoView(false);
    });
    this.hostMutationObserver.observe(hostElRef.nativeElement, {
      childList: true,
    });
  }

  ngOnDestroy(): void {
    this.hostMutationObserver.disconnect();
  }
}
