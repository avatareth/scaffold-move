import Image from "next/image";
import { NavItem } from "./NavItem";
import {
  MODULE_URL
} from "../utils/constants";

export function NavBar() {
  return (
    <nav className="navbar py-4 px-4 bg-base-100">
      <div className="flex-1 flex items-center gap-4">
        <a href="http://home.scaffold.rootmud.xyz" target="_blank" rel="noreferrer">
          <Image src="/logo.png" width={64} height={64} alt="logo" />
        </a>
        <ul className="menu menu-horizontal flex items-center gap-2">
          <NavItem href="/" title="Home" /> |
          <NavItem href="/example_ui" title="UI" /> |
          <NavItem href="/examples" title="Examples" /> |
          <li className="font-sans font-semibold text-base flex gap-2">
            <a href="http://cheatsheet.rootmud.xyz/" target="_blank" rel="noreferrer">Snippets</a> |
            <a href="https://assistant.aptosfoundation.org/" target="_blank" rel="noreferrer">AI Assistant</a> |
            <a href={MODULE_URL} target="_blank" rel="noreferrer">Contract on Explorer</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
