import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";

import {Check, ChevronsUpDown} from "lucide-react";
import {POSTCODES} from "@/lib/bd-geo-location";
import {Dispatch, SetStateAction} from "react";

export const PostCodeCombobox = ({orderDetails, setOrderDetails}: {
    orderDetails: {transactionId: string, address: string, postCode: string, phoneNumber: string},
    setOrderDetails: Dispatch<SetStateAction<{transactionId: string, address: string, postCode: string, phoneNumber: string}>>
}) => {

    const postCodeData = POSTCODES.map((postcode) => ({
        label: `${postcode.postCode} - ${postcode.postOffice}`,
        value: postcode.postCode,

    }))

    return (<Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                        "w-full justify-between",
                        !orderDetails.postCode && "text-muted-foreground"
                    )}
                >
                    {orderDetails.postCode
                        ? postCodeData.find(
                            (p) => p.value === orderDetails.postCode
                        )?.label
                        : "Select Post Code"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-2 max-h-[300px] overflow-auto">
                <Command>
                    <CommandInput placeholder="Search Post Code..."/>
                    <CommandEmpty>
                        No Post Code found
                    </CommandEmpty>
                    <CommandGroup>
                        {postCodeData.map((m) => (
                            <CommandItem
                                value={m.label}
                                key={m.value}
                                onSelect={() => {
                                    setOrderDetails(prevState => ({...prevState, postCode: m.value}));
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        m.value === orderDetails.postCode
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                                {m.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}