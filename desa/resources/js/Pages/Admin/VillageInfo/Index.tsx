import { Head, router, useForm } from '@inertiajs/react';
import axios from 'axios';
import {
    Building2,
    Check,
    ChevronDown,
    CirclePlus,
    Clock3,
    Globe2,
    Landmark,
    Lightbulb,
    Trash2,
    Users,
} from 'lucide-react';
import { useState, type FormEventHandler } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/ui/Button';
import Card, { CardBody, CardFooter, CardHeader } from '@/Components/ui/Card';
import EmptyState from '@/Components/ui/EmptyState';
import Field, { Input, Select, Textarea } from '@/Components/ui/Field';
import IconBox from '@/Components/ui/IconBox';
import type { LucideIcon } from 'lucide-react';

interface VillageInfoItem {
    id: number;
    key: string;
    value: string;
    group: string;
    label: string;
    order: number;
}
interface Props {
    groups: Record<string, VillageInfoItem[]>;
}

const groupLabels: Record<string, string> = {
    profil: 'Profil Desa',
    demografi: 'Demografi',
    geografi: 'Geografi',
    pemerintahan: 'Pemerintahan',
    sejarah: 'Sejarah',
    visi_misi: 'Visi & Misi',
};
const groupIcons: Record<string, LucideIcon> = {
    profil: Building2,
    demografi: Users,
    geografi: Globe2,
    pemerintahan: Landmark,
    sejarah: Clock3,
    visi_misi: Lightbulb,
};

export default function VillageInfoIndex({ groups }: Props) {
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(Object.keys(groups).map((key) => [key, true])),
    );
    const [editedItems, setEditedItems] = useState<Record<string, VillageInfoItem[]>>(() =>
        structuredClone(groups),
    );
    const [saving, setSaving] = useState<Record<string, boolean>>({});
    const [successGroup, setSuccessGroup] = useState<string | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        key: '',
        value: '',
        group: 'profil',
        label: '',
        order: 0,
    });

    const handleItemChange = (group: string, index: number, value: string) => {
        setEditedItems((previous) => ({
            ...previous,
            [group]: previous[group].map((item, itemIndex) =>
                itemIndex === index ? { ...item, value } : item,
            ),
        }));
    };
    const handleSaveGroup = async (group: string) => {
        setSaving((previous) => ({ ...previous, [group]: true }));
        try {
            await axios.put('/admin/village-info', {
                items:
                    editedItems[group]?.map((item) => ({ id: item.id, value: item.value })) || [],
            });
            setSuccessGroup(group);
            window.setTimeout(() => setSuccessGroup(null), 3000);
        } catch {
            window.alert('Gagal menyimpan perubahan. Silakan coba lagi.');
        } finally {
            setSaving((previous) => ({ ...previous, [group]: false }));
        }
    };
    const handleDelete = (id: number, label: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus "${label}"?`))
            router.delete(`/admin/village-info/${id}`, { preserveScroll: true });
    };
    const handleAdd: FormEventHandler = (event) => {
        event.preventDefault();
        post('/admin/village-info', { preserveScroll: true, onSuccess: () => reset() });
    };

    return (
        <AdminLayout title="Kelola Informasi Desa">
            <Head title="Kelola Informasi Desa - Admin Desa Muneng" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-ink-1">
                        Kelola Informasi Desa
                    </h1>
                    <p className="mt-1 text-ink-3">
                        Kelola data profil, demografi, geografi, dan informasi lainnya
                    </p>
                </div>
                <section className="space-y-4" aria-label="Kelompok informasi desa">
                    {Object.entries(editedItems).map(([group, items]) => {
                        const Icon = groupIcons[group] || Building2;
                        return (
                            <Card key={group}>
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-inset"
                                    onClick={() =>
                                        setOpenGroups((previous) => ({
                                            ...previous,
                                            [group]: !previous[group],
                                        }))
                                    }
                                    aria-expanded={openGroups[group]}
                                >
                                    <span className="flex items-center gap-3">
                                        <IconBox icon={Icon} variant="brand" size="md" />
                                        <span>
                                            <span className="block text-lg font-semibold text-ink-1">
                                                {groupLabels[group] || group}
                                            </span>
                                            <span className="block text-xs text-ink-3">
                                                {items.length} item
                                            </span>
                                        </span>
                                    </span>
                                    <ChevronDown
                                        className={
                                            openGroups[group]
                                                ? 'h-5 w-5 rotate-180 text-ink-4 transition-transform'
                                                : 'h-5 w-5 text-ink-4 transition-transform'
                                        }
                                        aria-hidden
                                    />
                                </button>
                                {openGroups[group] && (
                                    <CardBody className="space-y-4 border-t border-line">
                                        {items.length > 0 ? (
                                            <>
                                                {items.map((item, index) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex flex-col gap-3 rounded-xl bg-surface-2 p-3 sm:flex-row sm:items-start"
                                                    >
                                                        <div className="shrink-0 sm:w-1/4">
                                                            <label
                                                                htmlFor={`item-${item.id}`}
                                                                className="block text-sm font-medium text-ink-1"
                                                            >
                                                                {item.label}
                                                            </label>
                                                            <span className="text-xs text-ink-4">
                                                                {item.key}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1">
                                                            {item.value.length > 100 ? (
                                                                <Textarea
                                                                    id={`item-${item.id}`}
                                                                    rows={3}
                                                                    value={item.value}
                                                                    onChange={(event) =>
                                                                        handleItemChange(
                                                                            group,
                                                                            index,
                                                                            event.target.value,
                                                                        )
                                                                    }
                                                                />
                                                            ) : (
                                                                <Input
                                                                    id={`item-${item.id}`}
                                                                    value={item.value}
                                                                    onChange={(event) =>
                                                                        handleItemChange(
                                                                            group,
                                                                            index,
                                                                            event.target.value,
                                                                        )
                                                                    }
                                                                />
                                                            )}
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="min-h-11 min-w-11 self-start p-0 text-red-600"
                                                            aria-label={`Hapus ${item.label}`}
                                                            onClick={() =>
                                                                handleDelete(item.id, item.label)
                                                            }
                                                        >
                                                            <Trash2
                                                                className="h-4 w-4"
                                                                aria-hidden
                                                            />
                                                        </Button>
                                                    </div>
                                                ))}
                                                <div className="flex flex-wrap items-center gap-3 border-t border-line pt-3">
                                                    <Button
                                                        type="button"
                                                        loading={Boolean(saving[group])}
                                                        disabled={Boolean(saving[group])}
                                                        className="gap-2"
                                                        onClick={() => handleSaveGroup(group)}
                                                    >
                                                        <Check className="h-4 w-4" aria-hidden />
                                                        Simpan Perubahan
                                                    </Button>
                                                    {successGroup === group && (
                                                        <span className="text-sm font-medium text-brand-strong">
                                                            Berhasil disimpan!
                                                        </span>
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            <EmptyState
                                                icon={Icon}
                                                title="Belum ada data"
                                                description="Tambahkan data baru untuk grup ini melalui formulir di bawah."
                                                size="sm"
                                            />
                                        )}
                                    </CardBody>
                                )}
                            </Card>
                        );
                    })}
                </section>
                <form onSubmit={handleAdd}>
                    <Card>
                        <CardHeader className="flex items-center gap-3 border-b border-line">
                            <IconBox icon={CirclePlus} variant="accent" size="md" />
                            <div>
                                <h2 className="text-lg font-semibold text-ink-1">
                                    Tambah Data Baru
                                </h2>
                                <p className="text-xs text-ink-3">
                                    Tambahkan informasi baru ke profil desa
                                </p>
                            </div>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field label="Key" htmlFor="key" error={errors.key} required>
                                    <Input
                                        id="key"
                                        value={data.key}
                                        onChange={(event) => setData('key', event.target.value)}
                                        placeholder="Contoh: jumlah_rt"
                                        invalid={Boolean(errors.key)}
                                    />
                                </Field>
                                <Field label="Label" htmlFor="label" error={errors.label} required>
                                    <Input
                                        id="label"
                                        value={data.label}
                                        onChange={(event) => setData('label', event.target.value)}
                                        placeholder="Contoh: Jumlah RT"
                                        invalid={Boolean(errors.label)}
                                    />
                                </Field>
                            </div>
                            <Field label="Nilai" htmlFor="value" error={errors.value} required>
                                <Input
                                    id="value"
                                    value={data.value}
                                    onChange={(event) => setData('value', event.target.value)}
                                    placeholder="Contoh: 8"
                                    invalid={Boolean(errors.value)}
                                />
                            </Field>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field label="Grup" htmlFor="group" error={errors.group} required>
                                    <Select
                                        id="group"
                                        value={data.group}
                                        onChange={(event) => setData('group', event.target.value)}
                                        invalid={Boolean(errors.group)}
                                    >
                                        {Object.entries(groupLabels).map(([key, label]) => (
                                            <option key={key} value={key}>
                                                {label}
                                            </option>
                                        ))}
                                    </Select>
                                </Field>
                                <Field label="Urutan" htmlFor="order" error={errors.order}>
                                    <Input
                                        id="order"
                                        type="number"
                                        value={data.order}
                                        onChange={(event) =>
                                            setData(
                                                'order',
                                                Number.parseInt(event.target.value, 10) || 0,
                                            )
                                        }
                                        placeholder="0"
                                        invalid={Boolean(errors.order)}
                                    />
                                </Field>
                            </div>
                        </CardBody>
                        <CardFooter className="flex justify-end border-t border-line">
                            <Button
                                type="submit"
                                loading={processing}
                                disabled={processing}
                                className="gap-2"
                            >
                                <CirclePlus className="h-4 w-4" aria-hidden />
                                Tambah Data Baru
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
}
