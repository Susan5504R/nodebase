import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import  Link  from "next/link";
import { Input } from "./ui/input";
type EntityHeaderProps = {
    title: string;
    description?: string;
    newButtonLabel: string;
    disabled?: boolean;
    isCreating?: boolean;
} & (
    | {onNew : () => void; newButtonHref?: never }
    | {newButtonHref : string; onNew?: never}
    | {onNew?: never; newButtonHref?: never}
);

export const EntityHeader = ({
    title,
    description,
    newButtonLabel,
    disabled,
    isCreating,
    onNew,
    newButtonHref,
}: EntityHeaderProps) => {
    return (
        <div className="flex flex-row items-center justify-between gap-x-4">
            <div className="flex flex-col ">
                <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
                {description && <p className="text-xs md:text-sm text-muted-foreground">{description}</p>}
            </div>
            {onNew && !newButtonHref && (
                <Button disabled={isCreating || disabled} size="sm" onClick={onNew}>
                    <PlusIcon className="size-4"/>
                    {newButtonLabel}
                </Button>
            )}

            {onNew && newButtonHref && (
                <Button asChild size="sm">
                    <Link href={newButtonHref} prefetch>
                        <PlusIcon className="size-4"/>
                        {newButtonLabel}
                    </Link>
                    
                </Button>
            )}

        </div>
    )
};
type EntityContainerProps = {
    children: React.ReactNode;
    header: React.ReactNode;
    search?: React.ReactNode;
    pagination?: React.ReactNode;
}
export const EntityContainer = ({children, header, search, pagination}: EntityContainerProps) => {
        return (
            <div className="p-4 md:px-10 md:py-6 h-screen flex flex-col" >
                <div className="mx-auto mx-w-screen-xl w-full flex flex-col gap-y-8 flex-1">
                {header}
                
                <div className="flex flex-col gap-y-8 flex-1">
                    {search}
                    {children}
                </div>
                    {pagination}
            </div>
            </div>
        )
};
interface EntitySearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};
export const EntitySearch = ({value, onChange, placeholder ="Search"}: EntitySearchProps) => {
    return (
        <div className="relative ml-auto">
            <SearchIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
            <Input className="max-w-[200px] bg-background shadow-none border-border pl-8"
             value={value} 
             onChange={(e) => onChange(e.target.value)}
             placeholder={placeholder} />
        </div>
    )
}

interface EntityPaginationProps {
    page : number;
    totalPages : number;
    onPageChange : (page: number) => void;
    disabled?: boolean;
};
export const EntityPagination = ({page, totalPages, onPageChange, disabled} : EntityPaginationProps) => {
    return (
        <div className="flex items-center justify-between gap-x-2 w-full">
            <div className="text-sm text-muted-foreground flex-1" >
                Page {page} of {totalPages || 1}
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button disabled={disabled || page <= 1} 
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.max(1, page - 1))}>
                    Previous
                </Button>
                <Button disabled={disabled || page === totalPages || totalPages === 0} 
                size="sm"
                variant="outline"
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}>
                    Next
                </Button>
            </div>
        </div>
    )
}