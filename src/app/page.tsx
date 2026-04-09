import {
  Bell,
  CalendarDays,
  ChevronRight,
  HeartPulse,
  Mic,
  MoonStar,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const checkIns = [
  {
    title: "Morning readiness",
    detail: "2 min guided energy scan",
    icon: HeartPulse,
  },
  {
    title: "Nutrition pulse",
    detail: "Log lunch and hydration",
    icon: Sparkles,
  },
  {
    title: "Sleep prep",
    detail: "Wind-down routine at 21:30",
    icon: MoonStar,
  },
];

const quickStats = [
  { label: "Hydration", value: "1.6L", tone: "On track" },
  { label: "Resting HR", value: "62", tone: "Steady" },
  { label: "Mood", value: "Calm", tone: "Improving" },
];

export default function Home() {
  return (
    <main className="relative flex min-h-full flex-col overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(251,220,196,0.9)_0%,_rgba(255,244,235,0.92)_34%,_rgba(245,249,246,1)_72%)]">
      <div
        aria-hidden="true"
        className="absolute inset-x-[-15%] top-[-8%] h-64 rounded-full bg-[radial-gradient(circle,_rgba(98,163,125,0.25)_0%,_rgba(98,163,125,0)_70%)] blur-3xl"
      />

      <section className="relative flex flex-1 flex-col px-5 pt-7 pb-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Badge className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold tracking-[0.22em] text-primary uppercase shadow-none">
              Companion OS
            </Badge>
            <p className="text-sm text-muted-foreground">Thursday, April 9</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon-sm"
              className="rounded-full border-white/70 bg-white/70 backdrop-blur-sm"
            >
              <Bell className="size-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Avatar className="size-11 ring-2 ring-white/80 shadow-sm">
              <AvatarFallback className="bg-[#24543f] text-white">
                AL
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="mt-7 space-y-2">
          <h1 className="max-w-[12ch] text-4xl leading-[0.92] font-semibold tracking-[-0.08em] text-foreground">
            Your day looks steady.
          </h1>
          <p className="max-w-[28ch] text-sm leading-6 text-muted-foreground">
            We turned the home screen into a shadcn-based companion dashboard
            with believable health rituals and quick actions.
          </p>
        </div>

        <Card className="mt-6 overflow-hidden border-white/70 bg-white/80 shadow-2xl shadow-[#b46d4a]/10 backdrop-blur-sm">
          <CardHeader className="gap-4 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardDescription className="text-primary">
                  Daily program
                </CardDescription>
                <CardTitle className="mt-1 text-[1.75rem]">
                  68% complete
                </CardTitle>
              </div>
              <Badge
                variant="secondary"
                className="rounded-full bg-[#eff7f1] px-3 py-1 text-[#24543f]"
              >
                3 check-ins left
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Gentle recovery focus</span>
                <span>Goal 5 of 7</span>
              </div>
              <Progress value={68} className="h-2.5 bg-[#dfeadf]" />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-3xl bg-[#f7f3ee] p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                  <Stethoscope className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Coach insight
                  </p>
                  <p className="text-sm leading-5 text-muted-foreground">
                    Your sleep trend is recovering. Keep tonight light and aim
                    for a screen-free hour.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {checkIns.map(({ title, detail, icon: Icon }) => (
                <button
                  key={title}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-3xl border border-border/70 bg-background/80 px-4 py-3 text-left transition-colors hover:bg-accent"
                >
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {title}
                    </p>
                    <p className="text-sm text-muted-foreground">{detail}</p>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {quickStats.map((stat) => (
            <Card
              key={stat.label}
              className="rounded-[1.75rem] border-white/80 bg-white/75 shadow-lg shadow-black/5"
            >
              <CardContent className="p-4">
                <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                  {stat.label}
                </p>
                <p className="mt-3 text-xl font-semibold tracking-[-0.06em] text-foreground">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-primary">{stat.tone}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-5 border-white/70 bg-[#1f3b32] text-white shadow-xl shadow-[#1f3b32]/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-white/70">Quick note</p>
                <h2 className="text-xl font-semibold tracking-[-0.06em]">
                  How are you feeling right now?
                </h2>
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-white/12 text-white hover:bg-white/18"
              >
                <Mic className="size-4" />
                <span className="sr-only">Record voice note</span>
              </Button>
            </div>

            <Separator className="my-4 bg-white/12" />

            <form className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="reflection" className="text-white">
                  Daily reflection
                </Label>
                <Input
                  id="reflection"
                  placeholder="A little tense after lunch, but more settled now."
                  className="border-white/10 bg-white/8 text-white placeholder:text-white/45"
                />
              </div>
              <div className="flex gap-3">
                <Button className="h-11 flex-1 rounded-2xl bg-[#f7c8a7] font-semibold text-[#3e2716] hover:bg-[#f3bd98]">
                  Save note
                </Button>
                <Button
                  variant="outline"
                  className="h-11 rounded-2xl border-white/15 bg-transparent px-4 text-white hover:bg-white/10 hover:text-white"
                >
                  <CalendarDays className="size-4" />
                  Plan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
