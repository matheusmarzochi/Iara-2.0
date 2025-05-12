"use client";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/select";
import { userList } from "~/app/(admin)/admin/users/action";
import { duplicateResearch } from "~/lib/data/research";

type Props = {
    researchId: string;
};

export function DuplicateResearchButton({ researchId }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [users, setUsers] = useState<{ id: string, email: string }[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        async function fetchUsers() {
            const res = await userList({ email: "", limit: 100 });
            setUsers(res.items.map(u => ({ id: u.id, email: u.email })));
        }
        fetchUsers();
    }, [isOpen]);

    const handleDuplicate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedUserId) return;
        setLoading(true);
        await duplicateResearch(selectedUserId, researchId);
        setLoading(false);
        setIsOpen(false);
    };

    return (
        <>
            <Button className="w-full" variant="outline" onClick={() => setIsOpen(true)}>
                Duplicar Pesquisa
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Duplicar Pesquisa</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleDuplicate}>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium">Selecione o usuário</label>
                            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um usuário" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map(user => (
                                        <SelectItem key={user.id} value={user.id}>
                                            {user.email}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={!selectedUserId || loading}>
                                {loading ? "Duplicando..." : "Confirmar Duplicação"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
