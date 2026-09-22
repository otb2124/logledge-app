import { Component, inject } from "@angular/core";
import { DocumentService } from "./services/document/document.service.service";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  imports: [RouterOutlet],
})
export class AppComponent {
  private documentService: DocumentService = inject(DocumentService);

  ngOnInit(): void {

  }
}
