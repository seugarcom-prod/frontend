import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";

const HomeNavigationMenu: React.FC = () => {
  return (
    <NavigationMenu className="w-full">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Usuário</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
              <a
                href="/user/register"
                className="w-[120px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]"
              >
                Cadastro de usuário
              </a>
            </NavigationMenuLink>
            <NavigationMenuLink className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
              <a
                href="/list/user"
                className="w-[120px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]"
              >
                Listagem de usuário
              </a>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Restaurantes</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
              <a
                href="/restaurant/register"
                className="w-[120px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]"
              >
                Cadastro de restaurantes
              </a>
            </NavigationMenuLink>
            <NavigationMenuLink className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
              <a
                href="/list/restaurant"
                className="w-[120px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]"
              >
                Listagem de restaurantes
              </a>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="w-[120px]">
            Serviço
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
              <a
                href="/restaurant/service"
                className="w-[120px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]"
              >
                Testar serviço
              </a>
            </NavigationMenuLink>
            <NavigationMenuLink className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
              <a
                href="/restaurant/menu/new"
                className="w-[120px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]"
              >
                Cadastrar cardápio
              </a>
            </NavigationMenuLink>
            <NavigationMenuLink className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
              <a
                href="/restaurant/menu"
                className="w-[120px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]"
              >
                Verificar cardápio
              </a>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default HomeNavigationMenu;
